import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const CHANNEL_SERVICE_URL = process.env.CHANNEL_SERVICE_URL || 'http://localhost:6000';

export const sendCommunication = async (payload, retries = 3) => {
  try {
    const response = await axios.post(`${CHANNEL_SERVICE_URL}/send`, payload);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying communication for customer ${payload.customerId}, retries left: ${retries - 1}`);
      return sendCommunication(payload, retries - 1);
    } else {
      console.error(`Failed to send communication for customer ${payload.customerId} after retries.`, error.message);
      throw error;
    }
  }
};

export const sendBulkCommunications = async (messages) => {
  try {
    const promises = messages.map(msg => 
      sendCommunication({
        communicationId: msg.communicationId,
        campaignId: msg.campaignId,
        customerId: msg.customerId,
        channel: msg.channel,
        message: msg.message
      }).catch(err => {
        // Catch individual errors to prevent Promise.all from short-circuiting
        console.error(`Error in bulk sending for customer ${msg.customerId}:`, err.message);
        return null;
      })
    );
    
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Critical error in sendBulkCommunications:", error.message);
    throw error;
  }
};
