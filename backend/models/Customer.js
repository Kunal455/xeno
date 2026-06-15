import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  // Customer's full name
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  // Customer's email address, used for communication and identification
  email: {
    type: String,
    required: [true, 'Customer email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/, 'Please provide a valid email address'],
    index: true,
  },
  // Customer's phone number
  phone: {
    type: String,
    required: [true, 'Customer phone number is required'],
    trim: true,
  },
  // Total amount spent by the customer across all orders
  totalSpent: {
    type: Number,
    default: 0,
    min: [0, 'Total spent cannot be negative'],
  },
  // Total number of orders placed by the customer
  totalOrders: {
    type: Number,
    default: 0,
    min: [0, 'Total orders cannot be negative'],
  },
  // Date of the last purchase made by the customer
  lastPurchaseDate: {
    type: Date,
  },
  // Current status of the customer
  customerStatus: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'vip'],
      message: '{VALUE} is not a valid customer status',
    },
    default: 'active',
    index: true,
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt fields
});

export default mongoose.model('Customer', customerSchema);
