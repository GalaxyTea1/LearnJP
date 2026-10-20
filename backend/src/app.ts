import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { corsOptions } from './config/cors';
import { errorHandler } from './middlewares/errorHandler.middleware';
import routes from './routes';
import { sendSuccess } from './utils/response';
import { prisma } from './config/prisma';
import { env } from './config/env';

const app: Express = express();

// Middlewares
app.disable('x-powered-by');
if (env.TRUST_PROXY > 0) app.set('trust proxy', env.TRUST_PROXY);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
// Private previews and responses that vary by identity must never enter a shared cache.
app.use('/api/v1', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.vary('Authorization');
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/v1/health', async (req: Request, res: Response) => {
  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    sendSuccess(res, {
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }, 'Server is healthy and connected to database');
  } catch (error: any) {
    res.status(503).json({
      success: false,
      message: 'Server is running but database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// API v1 Routes
app.use('/api/v1', routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
