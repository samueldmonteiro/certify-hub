import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const databaseURL = new URL(connectionString);
const schema = databaseURL.searchParams.get('schema') ?? 'public';

const adapter = new PrismaPg({ connectionString }, { schema: schema });
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV == 'development' ? ['query'] : undefined,
});

export { prisma };