import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Segment from '../models/Segment.js';
import Campaign from '../models/Campaign.js';
import Communication from '../models/Communication.js';

dotenv.config();

const clearDatabase = async () => {
  try {
    console.log('Resetting database: clearing customers, orders, segments, campaigns, and communications...');
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await Segment.deleteMany({});
    await Campaign.deleteMany({});
    await Communication.deleteMany({});
    console.log('All historical seeded customer/campaign data removed.');
  } catch (error) {
    console.error('Error clearing database collections:', error.message);
  }
};

const seedDefaultUser = async () => {
  try {
    // Delete existing default user to ensure password gets encrypted by the pre-save hook
    await User.deleteOne({ email: 'arjun@xenocrm.io' });
    
    const defaultUser = new User({
      name: 'Arjun Rawat',
      email: 'arjun@xenocrm.io',
      password: 'password123'
    });
    await defaultUser.save();
    console.log('Auto-seeded default user successfully (arjun@xenocrm.io / password123).');
  } catch (error) {
    console.error('Error seeding default user:', error.message);
  }
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/minicrm';
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Clear mock customer data and ensure clean DB state (commented out to make MongoDB data storage persistent)
    // await clearDatabase();
    
    // Seed default user (arjun@xenocrm.io / password123)
    await seedDefaultUser();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
