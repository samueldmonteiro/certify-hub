import { User } from '@/src/core/domain/entities/user.entity';
import { UserViewModel } from '../view-models/user.view-model';

export class UserPresenter {
  static toViewModel(user: User): UserViewModel {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
