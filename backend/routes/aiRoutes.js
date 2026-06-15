import express from 'express';
import {
  generateAISegment,
  generateAIMessage,
  generateAIInsights
} from '../controllers/aiController.js';

const router = express.Router();

// Generate Customer Segment based on prompt
router.post('/segment', generateAISegment);

// Generate Marketing Message based on goal
router.post('/message', generateAIMessage);

// Generate Insights and Recommendations from campaign analytics data
router.post('/insights', generateAIInsights);

export default router;
