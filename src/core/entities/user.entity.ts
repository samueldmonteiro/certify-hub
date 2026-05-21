import { DomainError } from '../errors/domain.error';

export interface UserProps {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface UserViewModel {
  id: string;
  email: string;
  name: string;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.validateConstructor(props);
    this.props = { ...props };
  }

  private validateConstructor(props: UserProps) {
    if (!props.name || props.name.trim().length < 3) {
      throw new DomainError('Nome deve conter mais de 3 caracteres');
    }

    if (!props.password || props.password.length < 5) {
      throw new DomainError('Senha deve conter mais de 5 caracteres');
    }
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  // Relacionamentos (podem ser undefined se não carregados)
  /**get posts(): Post[] | undefined {
    return this.props.posts;
  }**/

  getPassword(): string {
    return this.props.password;
  }

  changePassword(newPassword: string): void {
    if (newPassword.length < 5) {
      throw new DomainError('Senha deve conter mais de 5 caracteres');
    }
    this.props.password = newPassword;
  }

  changeName(newName: string): void {
    if (!newName || newName.trim().length < 3) {
      throw new DomainError('Nome deve conter mais de 3 caracteres');
    }

    this.props.name = newName.trim();
  }

  toViewModel(): UserViewModel {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
    };
  }
}