import { Server } from 'http';
import app from './app.js';
import config from './config/index.js';
import { prisma } from './lib/prisma.js';

let server: Server;

async function main() {
  try {
    await prisma.$connect();
    server = app.listen(config.port, () => {
      console.log(`FooHub app listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`😈 unhandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      prisma.$disconnect();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('SIGINT is received');
  if (server) {
    server.close(() => {
      console.log("Process terminated!");
      prisma.$disconnect();
    });
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM is received');
  if (server) {
    server.close(() => {
      console.log("Process terminated!");
      prisma.$disconnect();
    });
  }
});
