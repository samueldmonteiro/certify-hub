import { prisma } from '@/src/lib/prisma';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';

beforeEach(async () => {
  await prisma.user.deleteMany({});
});
  
describe('test', () => {
 
  it('should sum correctly', async () => {
    await prisma.user.create({
      data: { name: 'ss1', email: 'id', password: 'iwjiwd' },
    });

    const a = 5 + 5;
    expect(a).toBe(10);
  });
});
