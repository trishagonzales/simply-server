import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserDTO } from '../../types/UserDTO.type';
import { UserMap } from '../../mappers/UserMap';
import { UserEntity } from '../../domain/UserEntity';
import { ErrorMap } from '../../../shared/app/error/Error.map';

interface Input {
  user: UserEntity;
}

type Output = Promise<Result<UserDTO>>;

export class GetUserDataUseCase implements UseCase<Input, Output> {
  async exec({ user }: Input) {
    try {
      return Result.ok<UserDTO>(UserMap.entityToDTO(user));
    } catch (e) {
      return ErrorMap.toUseCase<UserDTO>(e);
    }
  }
}
