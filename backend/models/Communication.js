import mongoose from 'mongoose';

const communicationSchema = new mongoose.Schema({
  // Reference to the Campaign this communication belongs to
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: [true, 'Communication must belong to a campaign'],
    index: true,
  },
  // Reference to the target Customer
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Communication must target a customer'],
    index: true,
  },
  // The communication channel used
  channel: {
    type: String,
    enum: {
      values: ['email', 'sms', 'whatsapp', 'rcs'],
      message: '{VALUE} is not a supported channel',
    },
    required: [true, 'Communication channel is required'],
  },
  // The actual message sent to the customer
  message: {
    type: String,
    required: [true, 'Message content is required'],
  },
  // Current status of this specific communication
  status: {
    type: String,
    enum: {
      values: ['sent', 'delivered', 'opened', 'read', 'clicked', 'failed'],
      message: '{VALUE} is not a valid communication status',
    },
    default: 'sent',
    index: true,
  },
  // Time when the last significant event (e.g., sent, delivered, opened) occurred
  eventTime: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt fields
});

// Compound index to quickly find all communications for a user in a specific campaign
communicationSchema.index({ campaignId: 1, customerId: 1 });

export default mongoose.model('Communication', communicationSchema);
