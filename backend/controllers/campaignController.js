import Campaign from '../models/Campaign.js';
import { launchCampaign as serviceLaunchCampaign } from '../services/campaignService.js';

// Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    const campaignData = { ...req.body };
    if (campaignData.channel) {
      campaignData.channel = campaignData.channel.toLowerCase();
    }
    if (campaignData.messageTemplate && !campaignData.message) {
      campaignData.message = campaignData.messageTemplate;
    }
    const campaign = new Campaign(campaignData);
    await campaign.save();
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Fetch all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate('segmentId', 'name');
    res.status(200).json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch a single campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('segmentId');
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a campaign
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!campaign) return res.status(404).json({ success: false, error: 'Campaign not found' });
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a campaign
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, error: 'Campaign not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Launch campaign via service
export const launchCampaign = async (req, res) => {
  try {
    const campaign = await serviceLaunchCampaign(req.params.id);
    res.status(200).json({ success: true, message: 'Campaign launched successfully', data: campaign });
  } catch (error) {
    const isValidationError = error.message.includes('No customers') || error.message.includes('not found') || error.message.includes('validation');
    res.status(isValidationError ? 400 : 500).json({ success: false, error: error.message });
  }
};
