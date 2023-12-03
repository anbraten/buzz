import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: './server/schemas/index.ts',
  out: './server/db/migrations',
  driver: 'turso',
  dbCredentials: {
    url: process.env.NUXT_TURSO_DB_URL as string,
    authToken: process.env.NUXT_TURSO_DB_AUTH_TOKEN as string,
  },
} satisfies Config;
