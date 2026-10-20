import { CorsOptions } from 'cors';
import { env } from './env';

export const allowedOrigins = [
  ...(env.NODE_ENV !== 'production' ? [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5500',
  'http://localhost:3000',
  ] : []),
  env.FRONTEND_URL,
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
