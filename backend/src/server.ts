import app from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

const PORT = env.PORT;

async function main() {
  // Verify database connection on startup
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
  });
}

main();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('👋 Server shut down');
  process.exit(0);
});
