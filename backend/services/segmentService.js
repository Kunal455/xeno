import Customer from '../models/Customer.js';
import Segment from '../models/Segment.js';
import { generateSegmentFromPrompt } from './aiService.js';

export const createSegment = async (criteria, name, description) => {
  try {
    const segment = new Segment({ name, description, criteria });
    await segment.save();
    return segment;
  } catch (error) {
    throw new Error("Failed to create segment: " + error.message);
  }
};

export const getCustomersByCriteria = async (criteria) => {
  try {
    const query = {};
    
    if (criteria.minSpent !== undefined) {
      query.totalSpent = { ...query.totalSpent, $gte: criteria.minSpent };
    }
    if (criteria.maxSpent !== undefined) {
      query.totalSpent = { ...query.totalSpent, $lte: criteria.maxSpent };
    }
    if (criteria.inactiveDays !== undefined) {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - criteria.inactiveDays);
      // Customer's lastPurchaseDate should be less than or equal to the dateLimit
      query.lastPurchaseDate = { $lte: dateLimit };
    }
    if (criteria.customerStatus !== undefined) {
      query.customerStatus = criteria.customerStatus;
    }
    
    const customers = await Customer.find(query);
    return customers;
  } catch (error) {
    throw new Error("Failed to get customers by criteria: " + error.message);
  }
};

export const generateAndSaveSegment = async (prompt, name, description = "") => {
  try {
    // 1. Prompt -> AI Service -> Criteria
    const criteria = await generateSegmentFromPrompt(prompt);
    
    // 2. Criteria -> Customer Query
    const customers = await getCustomersByCriteria(criteria);
    const customerIds = customers.map(c => c._id);
    
    // Generate a unique name if not provided
    const segmentName = name || `AI Segment - "${prompt.slice(0, 25)}${prompt.length > 25 ? '...' : ''}" (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})`;
    
    // 3. Create Segment
    const segment = new Segment({ 
      name: segmentName, 
      description: description || `AI generated segment for prompt: "${prompt}"`, 
      criteria,
      customerIds
    });
    
    // 4. Save and Return Segment
    await segment.save();
    return segment;
  } catch (error) {
    throw new Error("Failed to generate and save segment: " + error.message);
  }
};
