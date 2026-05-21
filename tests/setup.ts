import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/src/generated/prisma/client';
import { afterAll, beforeAll } from 'vitest';

// ─── Guard ───────────────────────────────────────────────────────────────────

if (!process.env.DATABASE_URL) {
  throw new Error('[setup] DATABASE_URL is not defined. Check your .env file.');
}

// ─── Isolated schema ─────────────────────────────────────────────────────────

const testSchema = `test_${randomUUID().replace(/-/g, '_')}`;

const databaseURL = new URL(process.env.DATABASE_URL);
databaseURL.searchParams.set('schema', testSchema);

// Overwrite so Prisma (and any service instantiated inside tests) picks it up.
process.env.DATABASE_URL = databaseURL.toString();

// ─── Prisma client (only used for teardown) ───────────────────────────────────

const adapter = new PrismaPg(
  { connectionString: process.env.DATABASE_URL },
  { schema: testSchema },
);
const prisma = new PrismaClient({ adapter });

// ─── Hooks ───────────────────────────────────────────────────────────────────

beforeAll(() => {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${testSchema}" CASCADE`,
  );
  await prisma.$disconnect();
});