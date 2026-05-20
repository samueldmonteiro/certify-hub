import { User } from '../entities/user.entity';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { ResourceNotFoundError } from '../errors/resource-not-found.error';
import { PasswordHasher } from '../providers/hasher/password-hasher';
import { IUserRepository } from '../repositories/user.repository';

export interface LoginUseCaseRequest {
  email: string,
  password: string
}

export interface LoginUseCaseResponse {
  user: User
}
export class AuthService {
  constructor(
    private userRepo: IUserRepository,
    private passwordHasher: PasswordHasher,
  ) { }

  async login(request: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
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