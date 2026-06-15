import mongoose from 'mongoose';
import Campaign from '../models/Campaign.js';
import Segment from '../models/Segment.js';
import Communication from '../models/Communication.js';
import Customer from '../models/Customer.js';
import { sendBulkCommunications } from './channelService.js';
import { sendEmail } from './mailService.js';
import { notifyClients } from '../config/socket.js';

export const createCampaign = async (data) => {
  try {
    const campaign = new Campaign(data);
    await campaign.save();
    return campaign;
  } catch (error) {
    throw new Error("Failed to create campaign: " + error.message);
  }
};

export const launchCampaign = async (campaignId) => {
  let campaign;
  try {
    // 1. Get Campaign
    campaign = await Campaign.findById(campaignId);
    if (!campaign) throw new Error("Campaign not found");
    
    // 2. Get Segment
    const segment = await Segment.findById(campaign.segmentId);
    if (!segment) throw new Error("Segment not found");

    // 3. Get Customers
    const customerIds = segment.customerIds;
    if (!customerIds || customerIds.length === 0) {
      campaign.status = 'failed';
      await campaign.save();
      notifyClients('campaign_status', { campaignId, name: campaign.name, status: 'failed', message: `Campaign "${campaign.name}" failed: No customers in segment.` });
      throw new Error("No customers in segment");
    }

    // Update campaign status to running
    campaign.status = 'running';
    await campaign.save();
    notifyClients('campaign_status', { campaignId, name: campaign.name, status: 'running', message: `Campaign "${campaign.name}" is now running...` });

    // Fetch customer details to construct communications and send real emails
    const customers = await Customer.find({ _id: { $in: customerIds } });

    // 4. Create Communication Records
    const communications = customers.map(customer => {
      // Personalize template message for each customer
      const personalizedMessage = campaign.message.replace(/\{\{name\}\}/g, customer.name);
      return {
        campaignId: campaign._id,
        customerId: customer._id,
        channel: campaign.channel,
        message: personalizedMessage,
        status: 'sent'
      };
    });

    const savedCommunications = await Communication.insertMany(communications);

    // Send Real Emails if channel is email
    if (campaign.channel === 'email') {
      console.log(`[Campaign Service] Dispatching real emails for campaign "${campaign.name}"...`);
      for (const comm of savedCommunications) {
        const customer = customers.find(c => c._id.toString() === comm.customerId.toString());
        if (customer) {
          // Asynchronously dispatch SMTP email
          sendEmail({
            to: customer.email,
            subject: campaign.name,
            html: `<h3>${campaign.name}</h3><p>${comm.message}</p>`,
            text: comm.message
          }).catch(err => console.error(`[Campaign Service] Nodemailer failed for customer ${customer.email}:`, err.message));
        }
      }
    }



    // 5. Send To Channel Service (simulates receipt cycle: delivered -> opened -> clicked)
    const payloads = savedCommunications.map(comm => ({
      communicationId: comm._id,
      campaignId: comm.campaignId,
      customerId: comm.customerId,
      channel: comm.channel,
      message: comm.message
    }));

    // Broadcast that messages are sent
    customers.forEach(customer => {
      notifyClients('message_status', {
        campaignId: campaign._id,
        campaignName: campaign.name,
        customerName: customer.name,
        channel: campaign.channel,
        status: 'sent',
        message: `Message sent to ${customer.name} via ${campaign.channel}`
      });
    });

    // Perform the bulk send operation asynchronously
    await sendBulkCommunications(payloads);

    // Update campaign stats and set to completed
    await updateCampaignStats(campaignId);
    
    campaign.status = 'completed';
    await campaign.save();

    notifyClients('campaign_status', { 
      campaignId, 
      name: campaign.name, 
      status: 'completed', 
      message: `Campaign "${campaign.name}" completed successfully!` 
    });
    
    return campaign;
  } catch (error) {
    if (campaign) {
      campaign.status = 'failed';
      await campaign.save();
    }
    notifyClients('campaign_status', { campaignId, name: campaign?.name || 'Campaign', status: 'failed', message: `Campaign failed: ${error.message}` });
    throw new Error("Failed to launch campaign: " + error.message);
  }
};

export const updateCampaignStats = async (campaignId) => {
  try {
    const objectId = new mongoose.Types.ObjectId(campaignId);
    
    const stats = await Communication.aggregate([
      { $match: { campaignId: objectId } },
      { $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    let updateData = {
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      clickedCount: 0,
      failedCount: 0
    };

    stats.forEach(stat => {
      const count = stat.count;
      const status = stat._id;
      
      // All communications count as sent
      updateData.sentCount += count;
      
      if (status === 'failed') {
        updateData.failedCount += count;
      }
      if (['delivered', 'opened', 'read', 'clicked'].includes(status)) {
        updateData.deliveredCount += count;
      }
      if (['opened', 'read', 'clicked'].includes(status)) {
        updateData.openedCount += count;
      }
      if (status === 'clicked') {
        updateData.clickedCount += count;
      }
    });

    await Campaign.findByIdAndUpdate(campaignId, updateData);
  } catch (error) {
    throw new Error("Failed to update campaign stats: " + error.message);
  }
};
