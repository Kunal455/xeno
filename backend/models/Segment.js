import mongoose from 'mongoose';

const segmentSchema = new mongoose.Schema({
  // Name of the segment
  name: {
    type: String,
    required: [true, 'Segment name is required'],
    trim: true,
    unique: true,
  },
  // Optional description of what this segment represents
  description: {
    type: String,
    trim: true,
  },
  // Criteria used to filter customers into this segment (e.g., { minSpent: 5000, inactiveDays: 60 })
  criteria: {
    type: mongoose.Schema.Types.Mixed, // Allows for a flexible JSON object structure
    default: {},
  },
  // Array of customer references that belong to this segment
  customerIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  }],
  // Reference to the user who created the segment (optional, typically used in production)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt fields
});

export default mongoose.model('Segment', segmentSchema);
