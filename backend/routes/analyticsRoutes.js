import express from 'express';
import {
  getAnalytics,
  getCampaignAnalytics,
  getOverviewAnalytics,
  getCampaignsAggregateAnalytics
} from '../controllers/analyticsController.js';

const router = express.Router();

// Return campaign performance metrics
router.get('/', getAnalytics);
router.get('/overview', getOverviewAnalytics);
router.get('/campaigns', getCampaignsAggregateAnalytics);
router.get('/campaign/:campaignId', getCampaignAnalytics);

export default router;
