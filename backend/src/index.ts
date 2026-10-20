import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './config/prisma';

const PORT = env.PORT || 3001;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Backend-figma server is running on http://localhost:${PORT}`);
  logger.info(`🏥 Health check endpoint: http://localhost:${PORT}/api/v1/health`);
  logger.info(`📦 Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.warn(`⚠️ Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: Error) => {
  logger.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
