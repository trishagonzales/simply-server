import { UserWithAvatar } from '../../user/types/UserModel.type';
import { PublicUserProps } from '../domain/MessageEntity';

export class PublicUserMap {
  static peristenceToDomain(user: UserWithAvatar): PublicUserProps {
    return {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatar?.url,
    };
  }
}
