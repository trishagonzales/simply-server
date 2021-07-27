import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../domain/UserEntity';
import { IUserRepo } from '../../repos/UserRepo';
import { IImageService } from '../services/ImageService';

interface Input {
  user: UserEntity;
}

type Output = Promise<Result<void>>;

export class DeleteAvatarUsecase implements UseCase<Input, Output> {
  constructor(private userRepo: IUserRepo, private imgService: IImageService) {}

  async exec({ user }: Input) {
    try {
      if (user.avatar) {
        const deletedOrError = await this.imgService.delete(user.avatar.publicID);
        if (!deletedOrError.isSuccess) throw deletedOrError.error;
      }

      return Result.ok<void>();
    } catch (e) {
      return ErrorMap.toUseCase<void>(e);
    }
  }
}
