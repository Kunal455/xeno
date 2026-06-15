import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  // Name of the campaign
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true,
  },
  // Reference to the target Segment for this campaign
  segmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Segment',
    required: [true, 'Campaign must have a target segment'],
    index: true,
  },
  // The message content to be sent to customers
  message: {
    type: String,
    required: [true, 'Campaign message is required'],
  },
  // The communication channel for the campaign
  channel: {
    type: String,
    enum: {
      values: ['email', 'sms', 'whatsapp', 'rcs'],
      message: '{VALUE} is not a supported channel',
    },
    required: [true, 'Campaign channel is required'],
  },
  // Current status of the campaign
  status: {
    type: String,
    enum: {
      values: ['draft', 'running', 'completed', 'failed'],
      message: '{VALUE} is not a valid status',
    },
    default: 'draft',
    index: true,
  },
  // Analytics: Total messages sent
  sentCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Analytics: Total messages successfully delivered
  deliveredCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Analytics: Total messages opened
  openedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Analytics: Total links clicked within the messages
  clickedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Analytics: Total messages that failed to send or deliver
  failedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt fields
});

export default mongoose.model('Campaign', campaignSchema);
