import { FileUpload } from 'graphql-upload';
import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../domain/UserEntity';
import { IUserRepo } from '../../repos/UserRepo';
import { IImageService } from '../services/ImageService';

interface Input {
  file: FileUpload;
  user: UserEntity;
}

type Output = Promise<Result<string>>;

export class UpdateAvatarUsecase implements UseCase<Input, Output> {
  constructor(private userRepo: IUserRepo, private imgService: IImageService) {}

  async exec({ file, user }: Input) {
    try {
      if (user.avatar) {
        const resOrError = await this.imgService.update(file, user.avatar.publicID);
        if (!resOrError.isSuccess) throw resOrError.error;

        const publicID = resOrError.value.public_id;
        const url = resOrError.value.secure_url;

        const updatedOrError = user.updateAvatar({ publicID, url });
        if (!updatedOrError.isSuccess) throw updatedOrError.error;

        await this.userRepo.save(user);

        return Result.ok<string>(url);
      } else {
        const resOrError = await this.imgService.create(file);
        if (!resOrError.isSuccess) throw resOrError.error;

        const publicID = resOrError.value.public_id;
        const url = resOrError.value.secure_url;

        const updatedOrError = user.updateAvatar({ publicID, url });
        if (!updatedOrError.isSuccess) throw updatedOrError.error;

        await this.userRepo.save(user);

        return Result.ok<string>(url);
      }
    } catch (e) {
      return ErrorMap.toUseCase<string>(e);
    }
  }
}
