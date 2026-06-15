import express from 'express';
import {
  createSegment,
  getAllSegments,
  getSegmentById,
  updateSegment,
  deleteSegment,
  generateSegment
} from '../controllers/segmentController.js';

const router = express.Router();

router.post('/', createSegment);
router.get('/', getAllSegments);
router.get('/:id', getSegmentById);
router.put('/:id', updateSegment);
router.delete('/:id', deleteSegment);

// AI-generated customer segment creation
router.post('/generate', generateSegment);

export default router;
