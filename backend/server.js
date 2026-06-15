import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import connectDB from './config/db.js';
import requestLogger from './middleware/logger.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { protect } from './middleware/authMiddleware.js';
import { initSocket } from './config/socket.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import segmentRoutes from './routes/segmentRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', protect, customerRoutes);
app.use('/api/orders', protect, orderRoutes);
app.use('/api/segments', protect, segmentRoutes);
app.use('/api/campaigns', protect, campaignRoutes);
app.use('/api/analytics', protect, analyticsRoutes);
app.use('/api/ai', protect, aiRoutes);
app.use('/api/receipt', webhookRoutes);

app.get('/', (req, res) => {
  res.send('Mini CRM API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`CRM Backend running on port ${PORT}`);
  });
}

export default app;

