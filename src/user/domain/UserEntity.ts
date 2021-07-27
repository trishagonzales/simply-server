import { Entity } from '../../shared/domain/Entity';
import { Guard } from '../../shared/app/Guard';
import { Result } from '../../shared/app/Result';
import { UserPassword } from './UserPassword';
import { BaseError } from '../../shared/app/error/BaseError';
import { UserAvatar, UserAvatarProps } from './UserAvatar';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: UserPassword;
  avatar?: UserAvatar;
  dateCreated: Date;
  isLoggedIn?: boolean;
}

export class UserEntity extends Entity<UserProps> {
  private constructor(props: UserProps) {
    super({ ...props, isLoggedIn: false });
  }

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get email() {
    return this.props.email;
  }
  get password() {
    return this.props.password;
  }
  get avatar() {
    return this.props.avatar;
  }
  get avatarUrl() {
    return this.props.avatar?.url;
  }
  get dateCreated() {
    return this.props.dateCreated;
  }
  get isLoggedIn() {
    return this.props.isLoggedIn;
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.props.isLoggedIn = isLoggedIn;
  }

  updateName(newName: string) {
    this.props.name = newName;
  }

  updateEmail(newEmail: string) {
    this.props.email = newEmail;
  }

  updatePassword(newPassword: string): Result<UserPassword> {
    const passwordOrError = UserPassword.create({
      value: newPassword,
      isHashed: false,
    });
    if (passwordOrError.isSuccess) this.props.password = passwordOrError.value;

    return passwordOrError;
  }

  updateAvatar(props: UserAvatarProps) {
    const propsGuard = Guard.nullOrUndefinedList(Object.values(props));
    if (!propsGuard.isSuccess) return BaseError.unexpected<UserEntity>(propsGuard.message);

    const avatarOrError = UserAvatar.create(props);
    if (avatarOrError.isSuccess) this.props.avatar = avatarOrError.value;

    return avatarOrError;
  }

  deleteAvatar() {
    if (this.avatar) delete this.props.avatar;
  }

  static create(props: UserProps) {
    const propsGuard = Guard.nullOrUndefinedList(Object.values(props));
    if (!propsGuard.isSuccess) return BaseError.unexpected<UserEntity>(propsGuard.message);

    return Result.ok<UserEntity>(new UserEntity(props));
  }
}
