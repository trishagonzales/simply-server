import { BaseError } from '../../../shared/app/error/BaseError';
import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../domain/UserEntity';

interface Input {
  password: string;
  user: UserEntity;
}

type Output = Promise<Result<boolean>>;

export class ValidatePasswordUseCase implements UseCase<Input, Output> {
  async exec({ password, user }: Input) {
    try {
      const isPasswordValid = await user.password.validate(password);
      if (!isPasswordValid) return BaseError.badRequest<boolean>('Invalid password');

      return Result.ok<boolean>(true);
    } catch (e) {
      return ErrorMap.toUseCase<boolean>(e);
    }
  }
}
