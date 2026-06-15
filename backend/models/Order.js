import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Reference to the Customer who placed the order
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Order must belong to a customer'],
    index: true,
  },
  // Total amount for the order
  amount: {
    type: Number,
    required: [true, 'Order amount is required'],
    min: [0, 'Order amount cannot be negative'],
  },
  // Array of products included in the order
  products: [{
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    }
  }],
  // Date when the order was placed
  orderDate: {
    type: Date,
    default: Date.now,
    index: true,
  },
  // Current payment status of the order
  paymentStatus: {
    type: String,
    enum: {
      values: ['paid', 'pending', 'failed'],
      message: '{VALUE} is not a valid payment status',
    },
    default: 'pending',
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt fields
});

export default mongoose.model('Order', orderSchema);
