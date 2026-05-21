import { beforeEach, describe, it, expect } from 'vitest';
import { PrismaUserRepository } from '@/src/core/repositories/prisma/prisma-user.repository';
import { AuthService } from '@/src/core/services/auth.service';
import { Argon2PasswordHasher } from '@/src/core/providers/hasher/argon2-password-hasher';
import { prisma } from '@/src/lib/prisma';

describe('AuthService (Integration)', () => {
  let sut: AuthService;

  beforeEach(async () => {
    await prisma.user.deleteMany();

    const userRepo = new PrismaUserRepository();
    const hasher = new Argon2PasswordHasher();
    sut = new AuthService(userRepo, hasher);
  });

  it('should login successfully with valid credentials', async () => {
    const hasher = new Argon2PasswordHasher();
    const hashedPassword = await hasher.hasher('correct-password');

    await prisma.user.create({
      data: {
        id: 'test-user-id',
        name: 'Usuário Teste',
        email: 'user@example.com',
        password: hashedPassword,
      },
    });

    const result = await sut.login({ email: 'user@example.com', password: 'correct-password' });

    expect(result.user.name).toBe('Usuário Teste');
    expect(result.user.email).toBe('user@example.com');
  });

  it('should throw ResourceNotFoundError when email does not exist', async () => {
    const { ResourceNotFoundError } = await import('@/src/core/errors/resource-not-found.error');

    await expect(
      sut.login({ email: 'unknown@example.com', password: 'any-password' }),
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should throw InvalidCredentialsError when password is wrong', async () => {
    const hasher = new Argon2PasswordHasher();
    const hashedPassword = await hasher.hasher('correct-password');

    await prisma.user.create({
      data: {
        id: 'test-user-id-2',
        name: 'Usuário Teste',
        email: 'user2@example.com',
        password: hashedPassword,
      },
    });

    const { InvalidCredentialsError } = await import('@/src/core/errors/invalid-credentials.error');

    await expect(
      sut.login({ email: 'user2@example.com', password: 'wrong-password' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
