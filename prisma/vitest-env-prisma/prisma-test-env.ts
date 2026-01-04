import { Client } from 'pg';
import { execSync } from 'node:child_process';
import type { Environment } from 'vitest/environments';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';

dotenv.config({
  path: '.env.test',
});

export default <Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',
  async setup() {

    const baseUrl = process.env.DATABASE_URL!;
    const schema = `test_${randomUUID().replace(/-/g, '')}`;

    const url = new URL(baseUrl);
    url.searchParams.set('schema', schema);

    process.env.DATABASE_URL = url.toString();

    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });

    return {
      async teardown() {
        const client = new Client({
          connectionString: process.env.DATABASE_URL?.split('?')[0], // URL sem o schema param
          connectionTimeoutMillis: 3000,
        });

        try {
          await client.connect();
          await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);

          console.log('Schema dropped successfully');
        } catch (error) {
          console.error('Error in teardown:', error);
        } finally {
          try {
            await client.end();
          } catch (e) {
            console.error('Error ending client:', e);
          }
        }
      },
    };
  },
};