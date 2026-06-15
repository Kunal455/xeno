import { 
  getOverallAnalytics, 
  getCampaignAnalytics as serviceGetCampaignAnalytics,
  getCampaignsAggregate
} from '../services/analyticsService.js';

export const getOverviewAnalytics = async (req, res) => {
  try {
    const stats = await getOverallAnalytics();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCampaignAnalytics = async (req, res) => {
  try {
    const analytics = await serviceGetCampaignAnalytics(req.params.campaignId);
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCampaignsAggregateAnalytics = async (req, res) => {
  try {
    const stats = await getCampaignsAggregate();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const stats = await getOverallAnalytics();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
