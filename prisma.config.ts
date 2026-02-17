import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  // earlyAccess is not supported in this version
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    // provider is defined in schema.prisma and not needed / allowed here in this context
    url: process.env.DATABASE_URL!,
  },
});
