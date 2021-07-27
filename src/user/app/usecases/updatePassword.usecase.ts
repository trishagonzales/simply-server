import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../domain/UserEntity';
import { IUserRepo } from '../../repos/UserRepo';

interface Input {
  password: string;
  user: UserEntity;
}

type Output = Promise<Result<void>>;

export class UpdatePasswordUsecase implements UseCase<Input, Output> {
  constructor(private userRepo: IUserRepo) {}

  async exec({ password, user }: Input) {
    try {
      const { isSuccess } = user.updatePassword(password);
      if (isSuccess) await this.userRepo.save(user);

      return Result.ok<void>();
    } catch (e) {
      return ErrorMap.toUseCase<void>(e);
    }
  }
}
