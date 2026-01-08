import { IUserRepository } from '@/src/core/domain/repositories/user.repository';
import { describe, vi, it, expect, Mocked, beforeEach } from 'vitest';
import { PasswordHasher } from '../../../domain/services/password-hasher';
import { LoginUseCase } from './login.use-case';
import { User } from '@/src/core/domain/entities/user.entity';
import { randomUUID } from 'node:crypto';
import { ResourceNotFoundError } from '@/src/core/domain/errors/resource-not-found.error';
import { InvalidCredentialsError } from '@/src/core/domain/errors/invalid-credentials.error';

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

  it('should return user on successful login', async () => {
    userRepoMock.findByEmail.mockResolvedValue(genericUser);
    passwordHasher.compare.mockResolvedValue(true);

    const response = await sut.execute({
      email: 'test@mail.com',
      password: '123456',
    });

    expect(response.user).instanceof(User);
  });

  it('should throw InvalidCredentialsError when email does not exist', async () => {
    userRepoMock.findByEmail.mockResolvedValue(null);
    passwordHasher.compare.mockResolvedValue(true);

    await expect(
      sut.execute({
        email: 'test@mail.com',
        password: '123456',
      }),
    ).rejects.instanceOf(ResourceNotFoundError);
  });

  it('should throw an InvalidCredentialsError when the password is incorrect', async () => {
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