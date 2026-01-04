import { prisma } from '@/src/lib/prisma';
import { describe, it, expect, afterAll, afterEach, beforeEach, beforeAll } from 'vitest';


beforeEach(async () => {
  await prisma.user.deleteMany({});
});

describe('test2', () => {

  it('should sum correctly2', async () => {


    await prisma.user.create({
      data: { name: 'ss2', email: 'id', password: 'iwjiwd' },
    });

    const a = 5 + 5;
    expect(a).toBe(10);
  });

  it('should sum correctly2', async () => {


    await prisma.user.create({
      data: { name: 'ss2', email: 'id', password: 'iwjiwd' },
    });

    const a = 5 + 5;
    expect(a).toBe(10);
  });
});
