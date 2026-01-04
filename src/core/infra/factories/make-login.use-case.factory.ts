import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { Argon2PasswordHasher } from '../criptography/argon2-password-hasher';
import { PrismaUserRepository } from '../database/prisma/prisma-user.repository';

export const makeLoginUseCase = () => {
  return new LoginUseCase(
    new PrismaUserRepository(),
    new Argon2PasswordHasher(),
  );
};