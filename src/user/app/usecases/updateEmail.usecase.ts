import { BaseError } from '../../../shared/app/error/BaseError';
import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../domain/UserEntity';
import { IUserRepo } from '../../repos/UserRepo';

interface Input {
  email: string;
  user: UserEntity;
}

type Output = Promise<Result<string>>;

export class UpdateEmailUsecase implements UseCase<Input, Output> {
  constructor(private userRepo: IUserRepo) {}

  async exec({ email, user }: Input) {
    try {
      if (await this.userRepo.exist(email))
        return BaseError.conflict<string>('Email already exists');

      user.updateEmail(email);
      await this.userRepo.save(user);

      return Result.ok<string>(email);
    } catch (e) {
      return ErrorMap.toUseCase<string>(e);
    }
  }
}
