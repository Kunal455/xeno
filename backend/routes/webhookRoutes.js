import express from 'express';
import { handleCommunicationCallback } from '../controllers/webhookController.js';

const router = express.Router();

// Receives callbacks from Channel Service
router.post('/', handleCommunicationCallback);

export default router;
