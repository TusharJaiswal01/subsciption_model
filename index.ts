import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDatabase } from './utils/database';
import { subscriptionRoutes } from './routes/subscriptionRoutes';
import { planRoutes } from './routes/planRoutes';
import { SubscriptionController } from './controllers/subscriptionController';
import { generateToken } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP'
});

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/plans', planRoutes);

app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Subscription Management Service'
  });
});

app.post('/api/auth/token', (req, res) => {
  const { userId, email } = req.body;
  
  if (!userId || !email) {
    return res.status(400).json({ error: 'userId and email are required' });
  }

  const token = generateToken(userId, email);
  res.json({ token, userId, email });
});


app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});



const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Run subscription expiry check every hour
    setInterval(() => {
      SubscriptionController.expireSubscriptions();
    }, 60 * 60 * 1000);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();