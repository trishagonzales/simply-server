import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { IUserRepo } from '../../repos/UserRepo';
import { UserDTO } from '../../types/UserDTO.type';

interface Input {
  id: string;
}

type Output = Promise<Result<UserDTO>>;

export class GetOneUserUsecase implements UseCase<Input, Output> {
  constructor(private userRepo: IUserRepo) {}

  async exec({ id }: Input) {
    try {
      const user = await this.userRepo.getById(id);

      return Result.ok<UserDTO>(user);
    } catch (e) {
      return ErrorMap.toUseCase<UserDTO>(e);
    }
  }
}
