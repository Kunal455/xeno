/**
 * Utility functions for calculating and formatting campaign metrics
 */

// Calculate Delivery Rate (Delivered / Sent)
export const calculateDeliveryRate = (sent, delivered) => {
  if (!sent || sent === 0) return 0;
  return Number(((delivered / sent) * 100).toFixed(2));
};

// Calculate Open Rate (Opened / Delivered)
export const calculateOpenRate = (delivered, opened) => {
  if (!delivered || delivered === 0) return 0;
  return Number(((opened / delivered) * 100).toFixed(2));
};

// Calculate Click Rate (Clicked / Opened)
export const calculateClickRate = (opened, clicked) => {
  if (!opened || opened === 0) return 0;
  return Number(((clicked / opened) * 100).toFixed(2));
};

// Generate a comprehensive campaign report object
export const generateCampaignReport = (stats) => {
  const { sent = 0, delivered = 0, opened = 0, clicked = 0, failed = 0 } = stats;
  
  const openRate = calculateOpenRate(delivered, opened);
  
  let performanceStatus = 'Poor';
  if (openRate >= 20) performanceStatus = 'Excellent';
  else if (openRate >= 10) performanceStatus = 'Average';

  return {
    rawCounts: { sent, delivered, opened, clicked, failed },
    rates: {
      deliveryRate: `${calculateDeliveryRate(sent, delivered)}%`,
      openRate: `${openRate}%`,
      clickRate: `${calculateClickRate(opened, clicked)}%`,
    },
    performanceStatus
  };
};
