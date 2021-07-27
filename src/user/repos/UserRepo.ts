import { PrismaClient } from '@prisma/client';
import { BaseError } from '../../shared/app/error/BaseError';
import { UserEntity } from '../domain/UserEntity';
import { UserMap } from '../mappers/UserMap';
import { SignupDTO } from '../app/usecases/signup.usecase';

export interface IUserRepo {
  exist: (email: string) => Promise<boolean>;
  save: (user: UserEntity) => Promise<void>;
  create: (data: SignupDTO) => Promise<UserEntity>;

  getById: (id: string) => Promise<UserEntity>;
  getByEmail: (email: string) => Promise<UserEntity>;
  getAll: () => Promise<UserEntity[]>;
  deleteById: (id: string) => Promise<void>;
}

export class UserRepo implements IUserRepo {
  constructor(private readonly prisma: PrismaClient) {}

  public async exist(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  public async save(user: UserEntity) {
    const data = await UserMap.entityToPersistence(user);
    await this.prisma.user.update({ where: { id: user.id }, data });
  }

  public async create(dto: SignupDTO) {
    const user = await this.prisma.user.create({ data: { ...dto } });

    const userOrError = UserMap.persistenceToDomain(user);
    if (!userOrError.isSuccess) throw userOrError.error;

    return userOrError.value;
  }

  public async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw BaseError.notFound<UserEntity>('User not found');

    const userOrError = UserMap.persistenceToDomain(user);
    if (!userOrError.isSuccess) throw userOrError.error;

    return userOrError.value;
  }

  public async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw BaseError.notFound<UserEntity>('User not found');

    const userOrError = UserMap.persistenceToDomain(user);
    if (!userOrError.isSuccess) throw userOrError.error;

    return userOrError.value;
  }

  public async getAll() {
    const users = await this.prisma.user.findMany({});

    return users.map(user => {
      const userEntity = UserMap.persistenceToDomain(user);
      if (!userEntity.isSuccess) throw userEntity.error;

      return userEntity.value;
    });
  }

  public async deleteById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw BaseError.notFound<boolean>('User not found');

    await this.prisma.user.delete({ where: { id } });
  }
}
