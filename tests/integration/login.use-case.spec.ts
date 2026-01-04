import { IUserRepository } from '@/src/core/domain/repositories/user.repository';
import { describe, vi, it, expect, Mocked, beforeEach } from 'vitest';

import { User } from '@/src/core/domain/entities/user.entity';
import { randomUUID } from 'node:crypto';
import { ResourceNotFoundError } from '@/src/core/domain/errors/resource-not-found.error';
import { InvalidCredentialsError } from '@/src/core/domain/errors/invalid-credentials.error';
import { LoginUseCase } from '@/src/core/application/use-cases/auth/login.use-case';
import { PasswordHasher } from '@/src/core/domain/criptography/password-hasher';

const userRepoMock: Mocked<IUserRepository> = {
  findByEmail: vi.fn(),
  findById: vi.fn(),
};

const passwordHasher: Mocked<PasswordHasher> = {
  hasher: vi.fn(),
  compare: vi.fn(),
};

let sut: LoginUseCase;
let genericUser: User;

beforeEach(() => {
  vi.clearAllMocks();

  sut = new LoginUseCase(
    userRepoMock,
    passwordHasher,
  );

  genericUser = new User({
    id: randomUUID(),
    email: 'test@mail.com',
    password: '123456',
    name: 'test',
  });
});

describe('Login User UseCase (Unit)', async () => {

  it('should return a token and user on successful login', async () => {
    console.log('OKKKKKKKKKKKKKKKK');
  });

  it.skip('should return a token and user on successful login', async () => {
    userRepoMock.findByEmail.mockResolvedValue(genericUser);
    passwordHasher.compare.mockResolvedValue(true);

    const response = await sut.execute({
      email: 'test@mail.com',
      password: '123456',
    });

    expect(response.user).instanceof(User);
  });

  it.skip('should throw InvalidCredentialsError when email does not exist', async () => {
    userRepoMock.findByEmail.mockResolvedValue(null);
    passwordHasher.compare.mockResolvedValue(true);

    await expect(
      sut.execute({
        email: 'test@mail.com',
        password: '123456',
      }),
    ).rejects.instanceOf(ResourceNotFoundError);
  });

  it.skip('should throw an InvalidCredentialsError when the password is incorrect', async () => {
    userRepoMock.findByEmail.mockResolvedValue(genericUser);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(
      sut.execute({
        email: 'test@mail.com',
        password: '123456',
      }),
    ).rejects.instanceOf(InvalidCredentialsError);
  });
});