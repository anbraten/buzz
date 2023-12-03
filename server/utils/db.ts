import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const tursoConfig = useRuntimeConfig().turso;

if (!tursoConfig.dbUrl || !tursoConfig.dbAuthToken) {
  throw new Error('Please fill the NUXT_TURSO_DB_URL and NUXT_TURSO_DB_AUTH_TOKEN env variables');
}

const client = createClient({
  url: tursoConfig.dbUrl,
  authToken: tursoConfig.dbAuthToken,
});

export const db = drizzle(client);
