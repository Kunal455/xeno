import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

// CRM Backend is configured on Port 5001
const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL || 'http://localhost:5001/api/receipt';

app.post('/send', (req, res) => {
  const { communicationId, campaignId, customerId, channel, message } = req.body;

  // Accept request as long as we have communicationId OR campaignId+customerId
  if (!communicationId && (!campaignId || !customerId)) {
    return res.status(400).json({ success: false, error: 'communicationId or (campaignId and customerId) is required' });
  }

  // Acknowledge receipt immediately
  res.status(200).json({ success: true, message: 'Message queued for delivery simulation' });

  // Simulate sequential asynchronous event flow (sent -> delivered -> opened -> clicked)
  // Step 1: Delivery status (delivered vs failed)
  const deliveryDelay = Math.floor(Math.random() * 1500) + 500; // 0.5 to 2 seconds
  
  setTimeout(async () => {
    const isDelivered = Math.random() < 0.9; // 90% chance of successful delivery
    const status1 = isDelivered ? 'delivered' : 'failed';
    
    try {
      console.log(`[Channel Service] ${channel} message for customer ${customerId || 'unknown'} -> ${status1}. Firing webhook...`);
      await axios.post(CRM_WEBHOOK_URL, {
        communicationId,
        campaignId,
        customerId,
        status: status1
      });
    } catch (error) {
      console.error(`[Channel Service] Webhook delivery callback failure:`, error.message);
      return; // Stop flow if webhook fails or it is a delivery failure
    }

    if (!isDelivered) return; // Stop if message failed to deliver

    // Step 2: Open status (opened)
    const openDelay = Math.floor(Math.random() * 2000) + 1000; // 1 to 3 seconds
    setTimeout(async () => {
      const isOpened = Math.random() < 0.7; // 70% chance of being opened if delivered
      if (!isOpened) return; // Stop if customer didn't open the message

      // Randomly choose 'opened' or 'read' status
      const status2 = Math.random() < 0.5 ? 'opened' : 'read';

      try {
        console.log(`[Channel Service] ${channel} message for customer ${customerId || 'unknown'} -> ${status2}. Firing webhook...`);
        await axios.post(CRM_WEBHOOK_URL, {
          communicationId,
          campaignId,
          customerId,
          status: status2
        });
      } catch (error) {
        console.error(`[Channel Service] Webhook open callback failure:`, error.message);
        return;
      }

      // Step 3: Click status (clicked)
      const clickDelay = Math.floor(Math.random() * 2000) + 1000; // 1 to 3 seconds
      setTimeout(async () => {
        const isClicked = Math.random() < 0.5; // 50% chance of clicking link if opened
        if (!isClicked) return;

        try {
          console.log(`[Channel Service] ${channel} message for customer ${customerId || 'unknown'} -> clicked. Firing webhook...`);
          await axios.post(CRM_WEBHOOK_URL, {
            communicationId,
            campaignId,
            customerId,
            status: 'clicked'
          });
        } catch (error) {
          console.error(`[Channel Service] Webhook click callback failure:`, error.message);
        }
      }, clickDelay);

    }, openDelay);

  }, deliveryDelay);
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Channel Simulation Service running on port ${PORT}`);
});
