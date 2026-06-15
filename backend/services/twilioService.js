import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const smsFrom = process.env.TWILIO_SMS_FROM;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886'; // Default Twilio sandbox whatsapp sender

let client = null;
const isConfigured = !!(accountSid && authToken && smsFrom);

if (isConfigured) {
  try {
    console.log(`[Twilio Service] Initializing Twilio client with Account SID: ${accountSid.slice(0, 8)}...`);
    client = twilio(accountSid, authToken);
  } catch (err) {
    console.error('[Twilio Service] Failed to initialize Twilio client:', err.message);
  }
} else {
  console.log('[Twilio Service] Twilio variables are not fully configured. Falling back to console-logging sandbox...');
}

const formatPhoneNumber = (phone) => {
  let cleaned = phone.replace(/\D/g, '');
  if (phone.startsWith('+')) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`; // Fallback to Indian code for 10-digit inputs
  }
  return `+${cleaned}`;
};

export const sendSMS = async ({ to, message }) => {
  const formattedTo = formatPhoneNumber(to);
  
  if (client && isConfigured) {
    try {
      console.log(`[Twilio Service] Sending SMS to ${formattedTo}...`);
      const response = await client.messages.create({
        body: message,
        from: smsFrom,
        to: formattedTo
      });
      console.log(`[Twilio Service] SMS sent successfully. Message SID: ${response.sid}`);
      return { success: true, messageId: response.sid };
    } catch (err) {
      console.error(`[Twilio Service] Twilio SMS dispatch failed for ${formattedTo}:`, err.message);
      throw err;
    }
  } else {
    console.log(`[MOCK TWILIO SMS] Sending message:`);
    console.log(`   To: ${formattedTo}`);
    console.log(`   From: ${smsFrom || 'MOCK_SENDER'}`);
    console.log(`   Content: ${message}`);
    return { success: true, messageId: `mock-sms-${Date.now()}` };
  }
};

export const sendWhatsApp = async ({ to, message }) => {
  const formattedTo = formatPhoneNumber(to);
  const formattedWhatsAppTo = `whatsapp:${formattedTo}`;
  
  if (client && isConfigured) {
    try {
      console.log(`[Twilio Service] Sending WhatsApp message to ${formattedWhatsAppTo}...`);
      const response = await client.messages.create({
        body: message,
        from: whatsappFrom,
        to: formattedWhatsAppTo
      });
      console.log(`[Twilio Service] WhatsApp message sent successfully. Message SID: ${response.sid}`);
      return { success: true, messageId: response.sid };
    } catch (err) {
      console.error(`[Twilio Service] Twilio WhatsApp dispatch failed for ${formattedWhatsAppTo}:`, err.message);
      throw err;
    }
  } else {
    console.log(`[MOCK TWILIO WHATSAPP] Sending message:`);
    console.log(`   To: ${formattedWhatsAppTo}`);
    console.log(`   From: ${whatsappFrom}`);
    console.log(`   Content: ${message}`);
    return { success: true, messageId: `mock-whatsapp-${Date.now()}` };
  }
};
