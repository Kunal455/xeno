import express from 'express';
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  launchCampaign
} from '../controllers/campaignController.js';

const router = express.Router();

router.post('/', createCampaign);
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

// Send campaign to Channel Service
router.post('/:id/launch', launchCampaign);

export default router;
