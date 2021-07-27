import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../domain/UserEntity';
import { IUserRepo } from '../../repos/UserRepo';

interface Input {
  name: string;
  user: UserEntity;
}

type Output = Promise<Result<string>>;

export class UpdateNameUsecase implements UseCase<Input, Output> {
  constructor(private userRepo: IUserRepo) {}

  async exec({ name, user }: Input) {
    try {
      user.updateName(name);
      await this.userRepo.save(user);

      return Result.ok<string>(user.name);
    } catch (e) {
      return ErrorMap.toUseCase<string>(e);
    }
  }
}
