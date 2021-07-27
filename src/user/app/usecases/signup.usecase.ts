import { BaseError } from '../../../shared/app/error/BaseError';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserPassword } from '../../domain/UserPassword';
import { UserMap } from '../../mappers/UserMap';
import { UserDTO } from '../../types/UserDTO.type';
import { IUserRepo } from '../../repos/UserRepo';
import { ErrorMap } from '../../../shared/app/error/Error.map';
import { IAuthService } from '../services/AuthService';

export interface SignupDTO {
  name: string;
  email: string;
  password: string;
}

interface SignupResult {
  userData: UserDTO;
  authToken: string;
}

interface Input {
  dto: SignupDTO;
}

type Output = Promise<Result<SignupResult>>;

export class SignupUsecase implements UseCase<Input, Output> {
  constructor(private userRepo: IUserRepo, private authService: IAuthService) {}

  async exec({ dto }: Input) {
    try {
      if (await this.userRepo.exist(dto.email))
        return BaseError.conflict<SignupResult>('User already exists');

      const passwordOrError = UserPassword.create({
        value: dto.password,
        isHashed: false,
      });
      if (!passwordOrError.isSuccess) throw passwordOrError.error;

      dto.password = await passwordOrError.value.hashedValue;
      const user = await this.userRepo.create(dto);
      const authToken = this.authService.createToken(user.id);

      user.setIsLoggedIn(true);

      return Result.ok<SignupResult>({ userData: UserMap.entityToDTO(user), authToken });
    } catch (e) {
      return ErrorMap.toUseCase<SignupResult>(e);
    }
  }
}
