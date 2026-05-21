import { beforeEach, describe, it, expect, vi, Mocked } from 'vitest';
import { AuthService } from './auth.service';
import { IUserRepository } from '../repositories/user.repository';
import { PasswordHasher } from '../providers/hasher/password-hasher';
import { User } from '../entities/user.entity';

const userRepositoryMock: Mocked<IUserRepository> = {
  findById: vi.fn(),
  findByEmail: vi.fn(),
};

const passwordHasherMock: Mocked<PasswordHasher> = {
  hasher: vi.fn(),
  compare: vi.fn(),
};

let sut: AuthService;

function makeUser(overrides: Partial<ConstructorParameters<typeof User>[0]> = {}) {
  return new User({
    id: 'user-1',
    email: 'user@example.com',
    name: 'Usuário Teste',
    password: 'hashed-password-123',
    ...overrides,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  sut = new AuthService(userRepositoryMock, passwordHasherMock);
});

describe('AuthService (Unit)', () => {
  it('should login successfully with valid credentials', async () => {
    const user = makeUser();
    userRepositoryMock.findByEmail.mockResolvedValue(user);
    passwordHasherMock.compare.mockResolvedValue(true);

    const result = await sut.login({ email: 'user@example.com', password: 'correct-password' });

    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('user@example.com');
    expect(passwordHasherMock.compare).toHaveBeenCalledWith(user.getPassword(), 'correct-password');
    expect(result.user).toBe(user);
  });

  it('should throw ResourceNotFoundError when email does not exist', async () => {
    const { ResourceNotFoundError } = await import('../errors/resource-not-found.error');
    userRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(
      sut.login({ email: 'unknown@example.com', password: 'any-password' }),
    ).rejects.toThrow(ResourceNotFoundError);

    expect(passwordHasherMock.compare).not.toHaveBeenCalled();
  });

  it('should throw InvalidCredentialsError when password does not match', async () => {
    const { InvalidCredentialsError } = await import('../errors/invalid-credentials.error');
    const user = makeUser();
    userRepositoryMock.findByEmail.mockResolvedValue(user);
    passwordHasherMock.compare.mockResolvedValue(false);

    await expect(
      sut.login({ email: 'user@example.com', password: 'wrong-password' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
