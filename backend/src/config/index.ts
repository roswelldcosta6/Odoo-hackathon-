import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET;

if (nodeEnv === 'production' && (!jwtSecret || jwtSecret.length < 32)) {
  throw new Error('JWT_SECRET must be set to at least 32 characters in production.');
}

/**
 * Environment configuration object
 */
export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  // The development fallback is intentionally not accepted in production.
  jwtSecret: jwtSecret || 'development-only-jwt-secret-change-before-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173',
};

/**
 * Singleton Prisma Client Instance for database queries
 */
export const prisma = new PrismaClient({
  log: config.nodeEnv === 'development' ? ['error', 'warn'] : ['error'],
});

export default { config, prisma };
