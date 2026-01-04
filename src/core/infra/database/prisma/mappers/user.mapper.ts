import { User as PrismaUser } from '@/generated/prisma/client';
import { User, UserProps } from '@/src/core/domain/entities/user.entity';

// Tipos auxiliares para relacionamentos
type PrismaUserWithRelations = PrismaUser & {
  //posts?: PrismaPost[];
  //roles?: (PrismaUserRole & { role: PrismaRole })[];
};

export class UserMapper {

  static toDomain(prismaUser: PrismaUserWithRelations): User {
    const userProps: UserProps = {
      id: prismaUser.id,
      email: prismaUser.email,
      name: prismaUser.name,
      password: prismaUser.password,
      // Relacionamentos são mapeados apenas se existirem
      //posts: prismaUser.posts?.map(post => PostMapper.toDomain(post)),
    };
    return new User(userProps);
  }

  static toDomainMany(prismaUsers: PrismaUserWithRelations[]): User[] {
    return prismaUsers.map(user => this.toDomain(user));
  }

  static toPrismaCreate(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.getPassword(),
    };
  }

  static toPrismaUpdate(user: User): Partial<Omit<PrismaUser, 'id' | 'createdAt'>> {
    return {
      email: user.email,
      name: user.name,
      password: user.getPassword(),
    };
  }
}
