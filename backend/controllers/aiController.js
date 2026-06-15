import { generateSegmentFromPrompt, generateMarketingMessage, generateCampaignInsights } from '../services/aiService.js';
import Campaign from '../models/Campaign.js';

export const generateAISegment = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required' });
    
    const criteria = await generateSegmentFromPrompt(prompt);
    res.status(200).json({ success: true, data: criteria });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const generateAIMessage = async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal) return res.status(400).json({ success: false, error: 'Goal is required' });

    const messageObj = await generateMarketingMessage(goal);
    res.status(200).json({ success: true, data: messageObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const generateAIInsights = async (req, res) => {
  try {
    let data = req.body;
    
    // If no campaign data is passed, fetch actual campaign stats from MongoDB
    if (!data || Object.keys(data).length === 0 || (data.campaignData && Object.keys(data.campaignData).length === 0)) {
      const campaigns = await Campaign.find().select('name sentCount deliveredCount openedCount clickedCount failedCount channel');
      data = { campaigns };
    }
    
    const insights = await generateCampaignInsights(data);
    
    // Map response to match frontend expectations:
    // Insights.jsx reads: insights.insights, insights.recommendations, insights.length
    res.status(200).json({ 
      success: true, 
      data: {
        insights: insights.summary || insights.insights || "No summary available.",
        recommendations: insights.recommendations || [],
        length: (insights.recommendations || []).length
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
