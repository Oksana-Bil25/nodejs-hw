import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(logger);
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(authRoutes);
app.use(notesRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
