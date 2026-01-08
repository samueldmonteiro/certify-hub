import { User } from '@/src/core/domain/entities/user.entity';
import { ResourceNotFoundError } from '@/src/core/domain/errors/resource-not-found.error';
import { IUserRepository } from '@/src/core/domain/repositories/user.repository';
import { PasswordHasher } from '../../../domain/services/password-hasher';
import { InvalidCredentialsError } from '@/src/core/domain/errors/invalid-credentials.error';

export interface LoginUseCaseRequest {
  email: string,
  password: string
}

export interface LoginUseCaseResponse {
  user: User
}

export class LoginUseCase {
  constructor(
    private userRepo: IUserRepository,
    private passwordHasher: PasswordHasher,
  ) { }

  async execute(request: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
    const userExists = await this.userRepo.findByEmail(request.email);
    if (!userExists) {
      throw new ResourceNotFoundError();
    }

    const doesPasswordMatches = await this.passwordHasher.compare(
      userExists.getPassword(),
      request.password,
    );

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user: userExists,
    };
  }
}