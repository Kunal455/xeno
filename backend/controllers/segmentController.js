import Segment from '../models/Segment.js';
import Customer from '../models/Customer.js';
import { generateAndSaveSegment } from '../services/segmentService.js';

// Create a new segment
export const createSegment = async (req, res) => {
  try {
    const segment = new Segment(req.body);
    await segment.save();
    res.status(201).json({ success: true, data: segment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Fetch all segments
export const getAllSegments = async (req, res) => {
  try {
    const segments = await Segment.find();
    res.status(200).json({ success: true, data: segments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch a single segment by ID
export const getSegmentById = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id).populate('customerIds', 'name email totalSpent');
    if (!segment) {
      return res.status(404).json({ success: false, error: 'Segment not found' });
    }
    res.status(200).json({ success: true, data: segment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a segment
export const updateSegment = async (req, res) => {
  try {
    const segment = await Segment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!segment) return res.status(404).json({ success: false, error: 'Segment not found' });
    res.status(200).json({ success: true, data: segment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a segment
export const deleteSegment = async (req, res) => {
  try {
    const segment = await Segment.findByIdAndDelete(req.params.id);
    if (!segment) return res.status(404).json({ success: false, error: 'Segment not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Generate AI Segment
export const generateSegment = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required' });
    
    const segment = await generateAndSaveSegment(prompt);
    await segment.populate('customerIds', 'name email totalSpent');
    res.status(201).json({ success: true, data: segment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Evaluate segment criteria and update customer list dynamically
export const buildSegment = async (req, res) => {
  try {
    const segment = await Segment.findById(req.params.id);
    if (!segment) {
      return res.status(404).json({ success: false, error: 'Segment not found' });
    }

    const criteria = segment.criteria || {};
    const matchingCustomers = await Customer.find(criteria).select('_id');
    const customerIds = matchingCustomers.map(c => c._id);

    segment.customerIds = customerIds;
    await segment.save();

    res.status(200).json({ 
      success: true, 
      message: `Segment updated with ${customerIds.length} customers`,
      data: segment 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
