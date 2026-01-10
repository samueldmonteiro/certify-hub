import { describe, it, expect, beforeEach } from 'vitest';

import { User } from '@/src/core/domain/entities/user.entity';
import { LoginUseCase } from '@/src/core/application/use-cases/auth/login.use-case';
import { prisma } from '@/src/lib/prisma';
import { PrismaUserRepository } from '@/src/core/infra/database/prisma/prisma-user.repository';
import { Argon2PasswordHasher } from '@/src/core/infra/criptography/argon2-password-hasher';

let sut: LoginUseCase;
const hasher = new Argon2PasswordHasher();

beforeEach(async () => {

  sut = new LoginUseCase(
    new PrismaUserRepository(),
    hasher,
  );

  await prisma.user.deleteMany({});
});

describe('Login User UseCase (Integration)', async () => {

  it('should return user on successful login', async () => {

    const hashPassword = await hasher.hasher('123456');
    await prisma.user.create({
      data: { name: 'test', 'email': 'test@email.com', 'password': hashPassword },
    });

    const response = await sut.execute({
      email: 'test@email.com',
      password: '123456',
    });

    expect(response.user).instanceof(User);
  });
});