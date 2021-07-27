import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../domain/UserEntity';
import { IUserRepo } from '../../repos/UserRepo';

interface Input {
  user: UserEntity;
}

type Output = Promise<Result<void>>;

export class DeleteAccountUsecase implements UseCase<Input, Output> {
  constructor(private userRepo: IUserRepo) {}

  async exec({ user }: Input) {
    try {
      await this.userRepo.deleteById(user.id);

      return Result.ok<void>();
    } catch (e) {
      return ErrorMap.toUseCase<void>(e);
    }
  }
}
