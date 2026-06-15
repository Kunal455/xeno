import axios from 'axios';
import { io } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:5001/api';

async function runVerification() {
  console.log('--- Starting CRM Sockets and SMTP End-to-End Verification ---');

  let socketConnected = false;
  let receivedEvents = [];

  // 1. Establish socket connection
  console.log('1. Connecting socket client to backend...');
  const socket = io('http://localhost:5001', {
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('   Socket connected successfully! ID:', socket.id);
    socketConnected = true;
  });

  socket.on('campaign_status', (data) => {
    console.log('   [Socket Event] campaign_status:', data);
    receivedEvents.push({ event: 'campaign_status', ...data });
  });

  socket.on('message_status', (data) => {
    console.log('   [Socket Event] message_status:', data);
    receivedEvents.push({ event: 'message_status', ...data });
  });

  // Give socket 1.5s to establish connection
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!socketConnected) {
    console.error('❌ Socket connection failed.');
    socket.disconnect();
    process.exit(1);
  }

  try {
    // 2. Authenticate / Login
    console.log('2. Logging in...');
    const loginRes = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: 'arjun@xenocrm.io',
      password: 'password123'
    });
    
    const token = loginRes.data.data.token;
    const client = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // 3. Create customer
    console.log('3. Creating a test customer...');
    const customerRes = await client.post('/customers', {
      name: 'SMTP Socket Tester',
      email: `smtp_socket_test_${Date.now()}@ethereal.email`,
      phone: '9876543210',
      totalSpent: 6000,
      lastPurchaseDate: '2026-01-01'
    });
    const customer = customerRes.data.data;
    console.log(`   Customer created: ${customer.name}`);

    // 4. Generate Segment
    console.log('4. Generating Segment...');
    const segmentRes = await client.post('/segments/generate', {
      prompt: 'Find customers who spent more than ₹5000'
    });
    const segment = segmentRes.data.data;
    console.log(`   Segment generated: ID ${segment._id}, size ${segment.customerIds.length}`);

    // 5. Create and Launch Campaign
    console.log('5. Creating & launching Email Campaign...');
    const campaignRes = await client.post('/campaigns', {
      name: 'Real-time Test Campaign',
      segmentId: segment._id,
      channel: 'email',
      message: 'Hi {{name}}, this is a real-time SMTP and Socket.io test!',
      status: 'draft'
    });

    const campaign = campaignRes.data.data;
    console.log(`   Campaign created: ID ${campaign._id}. Launching...`);
    
    await client.post(`/campaigns/${campaign._id}/launch`);
    console.log('   Campaign launched. Waiting 4 seconds for simulation webhook callbacks...');
    
    // Wait for webhook updates to arrive and trigger socket events
    await new Promise(resolve => setTimeout(resolve, 4000));

    socket.disconnect();

    // 6. Verify received notifications
    console.log('6. Verifying captured Socket events...');
    console.log(`   Total events received: ${receivedEvents.length}`);
    
    const runningEvent = receivedEvents.find(e => e.event === 'campaign_status' && e.status === 'running');
    const sentEvent = receivedEvents.find(e => e.event === 'message_status' && e.status === 'sent');
    const deliveredEvent = receivedEvents.find(e => e.event === 'message_status' && e.status === 'delivered');
    const completedEvent = receivedEvents.find(e => e.event === 'campaign_status' && e.status === 'completed');

    if (!runningEvent) throw new Error('Missing "campaign_status" (running) event');
    if (!sentEvent) throw new Error('Missing "message_status" (sent) event');
    if (!deliveredEvent) throw new Error('Missing "message_status" (delivered) event');
    if (!completedEvent) throw new Error('Missing "campaign_status" (completed) event');

    console.log('   All events successfully captured!');
    console.log('\n✅ End-to-End SMTP & Socket.io Integration Succeeded!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Verification Failed:', error.response?.data || error.message);
    socket.disconnect();
    process.exit(1);
  }
}

runVerification();
