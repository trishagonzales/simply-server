import { User as UserModel } from '@prisma/client';
import { UserEntity } from '../domain/UserEntity';
import { UserPassword } from '../domain/UserPassword';
import { UserDTO } from '../types/UserDTO.type';
import { Result } from '../../shared/app/Result';

export class UserMap {
  static entityToDTO(user: UserEntity): UserDTO {
    const { id, name, email, dateCreated, avatarUrl } = user;

    const dto: UserDTO = {
      id,
      name,
      email,
      dateCreated,
      avatarUrl,
    };

    return dto;
  }

  static persistenceToDomain(data: UserModel): Result<UserEntity> {
    const passwordRes = UserPassword.create({ value: data.password, isHashed: true });

    return UserEntity.create({ ...data, password: passwordRes.value });
  }

  static async entityToPersistence(user: UserEntity): Promise<UserModel> {
    const { id, name, email, dateCreated, password } = user;

    const data: UserModel = {
      id,
      name,
      email,
      dateCreated,
      password: password.props.isHashed ? password.props.value : await password.hashedValue,
    };

    return data;
  }
}
