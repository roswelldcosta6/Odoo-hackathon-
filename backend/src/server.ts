import app from './app';
import { config, prisma } from './config';

// ─── Start HTTP Server ────────────────────────────────────────────────────────
const server = app.listen(config.port, async () => {
  console.log('=========================================');
  console.log(`🚀 Dayflow HRMS Server running on port ${config.port}`);
  console.log(`🌐 Environment: ${config.nodeEnv}`);
  console.log(`📡 API Base: http://localhost:${config.port}/api`);
  console.log('=========================================');

  try {
    await prisma.$connect();
    console.log('✅ Connected to MySQL database via Prisma');
  } catch (err) {
    console.error('❌ Failed to connect to MySQL database:', err);
  }
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const handleShutdown = async () => {
  console.log('\nGracefully shutting down Dayflow server...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Database disconnected. Exiting.');
    process.exit(0);
  });
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
