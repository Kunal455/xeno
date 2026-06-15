import Communication from '../models/Communication.js';
import Campaign from '../models/Campaign.js';
import { updateCampaignStats } from '../services/campaignService.js';
import { notifyClients } from '../config/socket.js';

export const handleCommunicationCallback = async (req, res) => {
  try {
    const { communicationId, campaignId, customerId, status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, error: 'Missing status' });
    }

    let communication;
    if (communicationId) {
      communication = await Communication.findById(communicationId);
    } else if (campaignId && customerId) {
      communication = await Communication.findOne({ campaignId, customerId });
    }

    if (!communication) {
      return res.status(404).json({ success: false, error: 'Communication not found' });
    }

    communication.status = status;
    communication.eventTime = Date.now();
    await communication.save();

    // Re-calculate and update the campaign stats dynamically
    await updateCampaignStats(communication.campaignId);

    // Populate customer details and fetch campaign name to enrich socket message
    await communication.populate('customerId', 'name');
    const campaign = await Campaign.findById(communication.campaignId).select('name');

    notifyClients('message_status', {
      campaignId: communication.campaignId,
      campaignName: campaign?.name || 'Campaign',
      customerName: communication.customerId?.name || 'Customer',
      channel: communication.channel,
      status: status,
      message: `Message for ${communication.customerId?.name || 'customer'} was ${status}`
    });

    res.status(200).json({ success: true, message: 'Communication status updated' });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
