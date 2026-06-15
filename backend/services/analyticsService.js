import Campaign from '../models/Campaign.js';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import Communication from '../models/Communication.js';

export const getCampaignAnalytics = async (campaignId) => {
  try {
    const campaign = await Campaign.findById(campaignId)
      .select('sentCount deliveredCount openedCount clickedCount failedCount');
      
    if (!campaign) throw new Error("Campaign not found");
    
    return {
      sent: campaign.sentCount,
      delivered: campaign.deliveredCount,
      opened: campaign.openedCount,
      clicked: campaign.clickedCount,
      failed: campaign.failedCount
    };
  } catch (error) {
    throw new Error("Failed to get campaign analytics: " + error.message);
  }
};

export const getCampaignsAggregate = async () => {
  try {
    const result = await Campaign.aggregate([
      {
        $group: {
          _id: null,
          totalSent: { $sum: '$sentCount' },
          totalDelivered: { $sum: '$deliveredCount' },
          totalOpened: { $sum: '$openedCount' },
          totalClicked: { $sum: '$clickedCount' },
          totalFailed: { $sum: '$failedCount' }
        }
      }
    ]);
    
    if (result.length > 0) {
      return result[0];
    } else {
      return {
        totalSent: 0,
        totalDelivered: 0,
        totalOpened: 0,
        totalClicked: 0,
        totalFailed: 0
      };
    }
  } catch (error) {
    throw new Error("Failed to get campaigns aggregate analytics: " + error.message);
  }
};

export const getOverallAnalytics = async () => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const totalCommunications = await Communication.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const revenueAggregation = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Aggregate Revenue Trend by month
    const revenueTrendRaw = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$orderDate' } },
          value: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let revenueTrend = revenueTrendRaw.map(item => {
      const monthIndex = parseInt(item._id.split('-')[1]) - 1;
      return {
        name: monthNames[monthIndex] || item._id,
        value: item.value
      };
    });

    // Fallback if no trend data exists
    if (revenueTrend.length === 0) {
      revenueTrend = [
        { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 },
        { name: 'Mar', value: 0 }, { name: 'Apr', value: 0 },
        { name: 'May', value: 0 }, { name: 'Jun', value: 0 }
      ];
    }

    // Aggregate Customer Growth (using lastPurchaseDate as proxy for activity timing)
    const customerTrendRaw = await Customer.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$lastPurchaseDate' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    let cumulative = 0;
    let customerGrowth = customerTrendRaw.map(item => {
      cumulative += item.count;
      const monthIndex = parseInt(item._id.split('-')[1]) - 1;
      return {
        name: monthNames[monthIndex] || item._id,
        value: cumulative
      };
    });

    if (customerGrowth.length === 0) {
      customerGrowth = [
        { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 },
        { name: 'Mar', value: 0 }, { name: 'Apr', value: 0 },
        { name: 'May', value: 0 }, { name: 'Jun', value: 0 }
      ];
    }

    return {
      totalCustomers,
      totalCampaigns,
      totalCommunications,
      totalOrders,
      totalRevenue,
      revenueTrend,
      customerGrowth
    };
  } catch (error) {
    throw new Error("Failed to get overall analytics: " + error.message);
  }
};

export const calculateRates = async (campaignId) => {
  try {
    const analytics = await getCampaignAnalytics(campaignId);
    
    const deliveryRate = analytics.sent > 0 ? (analytics.delivered / analytics.sent) : 0;
    const openRate = analytics.delivered > 0 ? (analytics.opened / analytics.delivered) : 0;
    const clickRate = analytics.opened > 0 ? (analytics.clicked / analytics.opened) : 0;

    return {
      deliveryRate: (deliveryRate * 100).toFixed(2) + '%',
      openRate: (openRate * 100).toFixed(2) + '%',
      clickRate: (clickRate * 100).toFixed(2) + '%'
    };
  } catch (error) {
    throw new Error("Failed to calculate rates: " + error.message);
  }
};
