import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../domain/UserEntity';
import { IUserRepo } from '../../repos/UserRepo';
import { UserDTO } from '../../types/UserDTO.type';

type Output = Promise<Result<UserDTO[]>>;

export class GetAllUsersUsecase implements UseCase<void, Output> {
  constructor(private userRepo: IUserRepo) {}

  async exec() {
    try {
      const users = await this.userRepo.getAll();

      return Result.ok<UserDTO[]>(users);
    } catch (e) {
      return ErrorMap.toUseCase<UserDTO[]>(e);
    }
  }
}
