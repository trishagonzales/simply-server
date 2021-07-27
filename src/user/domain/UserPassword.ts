import bcrypt from 'bcryptjs';

import { ValueObject } from '../../shared/domain/ValueObject';
import { Guard } from '../../shared/app/Guard';
import { Result } from '../../shared/app/Result';
import { BaseError } from '../../shared/app/error/BaseError';

export interface UserPasswordProps {
  value: string;
  isHashed: boolean;
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  private static readonly minLength: number = 8;

  get value() {
    return this.props.value;
  }

  get hashedValue() {
    return this.props.isHashed ? this.props.value : this.hashPassword(this.props.value);
  }

  private constructor(props: UserPasswordProps) {
    super(props);
  }

  public validate(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.value);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  }

  private static validateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  public static create(props: UserPasswordProps) {
    const nullGuard = Guard.nullOrUndefined(props.value);
    if (!nullGuard.isSuccess) return BaseError.unexpected<UserPassword>(nullGuard.message);

    if (!props.isHashed && !this.validateLength(props.value))
      return BaseError.badRequest<UserPassword>(
        `Password length must be minimum ${this.minLength}`
      );

    return Result.ok<UserPassword>(new UserPassword(props));
  }
}
