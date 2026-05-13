import { defineConfig } from '@prisma/config';
import config from './src/config/index.js';

export default defineConfig({
  datasource: {
    url: config.database_url,
  },
  migrations: {
    seed: 'tsx ./prisma/seed.ts',
  }
});