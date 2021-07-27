import { BaseError } from '../../shared/app/error/BaseError';
import { Guard } from '../../shared/app/Guard';
import { Result } from '../../shared/app/Result';
import { ValueObject } from '../../shared/domain/ValueObject';

export interface UserAvatarProps {
  publicID: string;
  url: string;
}

export class UserAvatar extends ValueObject<UserAvatarProps> {
  get publicID() {
    return this.props.publicID;
  }

  get url() {
    return this.props.url;
  }

  private constructor(props: UserAvatarProps) {
    super(props);
  }

  public static create(props: UserAvatarProps) {
    const nullGuard = Guard.nullOrUndefinedList(Object.values(props));
    if (!nullGuard.isSuccess) return BaseError.unexpected<UserAvatar>(nullGuard.message);

    return Result.ok<UserAvatar>(new UserAvatar(props));
  }
}
