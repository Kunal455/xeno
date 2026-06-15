/**
 * Utility functions for parsing audience criteria into MongoDB queries
 */

// Dynamically builds a Mongoose query object based on flexible JSON criteria
export const buildCustomerQuery = (criteria) => {
  const query = {};
  
  if (!criteria || Object.keys(criteria).length === 0) {
    return query;
  }

  if (criteria.minSpent !== undefined) {
    query.totalSpent = { ...query.totalSpent, $gte: Number(criteria.minSpent) };
  }
  
  if (criteria.maxSpent !== undefined) {
    query.totalSpent = { ...query.totalSpent, $lte: Number(criteria.maxSpent) };
  }
  
  if (criteria.inactiveDays !== undefined) {
    const dateLimit = new Date();
    // Subtract the inactive days from current date
    dateLimit.setDate(dateLimit.getDate() - Number(criteria.inactiveDays));
    
    // Customers whose last purchase is older than or equal to the calculated limit date
    query.lastPurchaseDate = { $lte: dateLimit };
  }
  
  if (criteria.customerStatus) {
    query.customerStatus = criteria.customerStatus;
  }

  // Add more flexible filter checks as your schema grows
  // Example: if (criteria.location) query.city = criteria.location;

  return query;
};
