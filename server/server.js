import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/project.js';
import portfolioRoutes from './routes/portfolio.js';
import collectionsRoutes from './routes/collections.js';
import messagesRoutes from './routes/messages.js';
import dashboardRoutes from './routes/dashboard.js';
import { seedMongoDb } from './config/dbSeeder.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading images from different origins
}));

// CORS Configuration
app.use(cors({
  origin: '*', // Allow all for local development, customize in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Ensure uploads folder exists and mount static uploads route
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Route Definitions
app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root path response
app.get('/', (req, res) => {
  res.json({
    message: 'PortfolioX Secure Platform API is running',
    status: 'online',
    db_connected: mongoose.connection.readyState === 1
  });
});

// Start server and database connection
const startServer = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfoliox';
  
  console.log('Attempting connection to MongoDB...');
  
  try {
    // Set a timeout of 3000ms for connection attempts
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✔ MongoDB Atlas/Local connected successfully!');
    await seedMongoDb();
  } catch (error) {
    console.warn('\n⚠️ WARNING: Could not connect to MongoDB server.');
    console.warn('Reason:', error.message);
    console.warn('💡 ACTION: Running in RESILIENT FALLBACK MODE using local file database (data/db_fallback.json).');
    console.warn('This ensures the backend works 100% without any MongoDB setup!\n');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  });
};

startServer();
