import { User } from '@/src/core/domain/entities/user.entity';
import { IUserRepository } from '@/src/core/domain/repositories/user.repository';
import { prisma } from '@/src/lib/prisma';
import { UserMapper } from './mappers/user.mapper';

export class PrismaUserRepository implements IUserRepository {

  async findById(id: string): Promise<User | null> {
    const data = await prisma.user.findUnique({ where: { id } });
    if (!data) return null;
    return UserMapper.toDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({ where: { email } });
    if (!data) return null;
    return UserMapper.toDomain(data);
  }
}