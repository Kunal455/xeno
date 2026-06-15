import Order from '../models/Order.js';
import Customer from '../models/Customer.js';

// Create a new order and update the associated Customer
export const createOrder = async (req, res) => {
  try {
    const { customerId, amount, products, paymentStatus } = req.body;

    // 1. Create the order
    const order = new Order({
      customerId,
      amount,
      products,
      paymentStatus
    });
    
    await order.save();

    // 2. Update the customer stats (totalSpent, totalOrders, lastPurchaseDate)
    await Customer.findByIdAndUpdate(customerId, {
      $inc: { totalSpent: amount, totalOrders: 1 },
      $set: { lastPurchaseDate: Date.now() }
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Fetch all orders with pagination
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Order.countDocuments();

    res.status(200).json({
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customerId', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
