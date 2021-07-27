import { BaseError } from '../../../shared/app/error/BaseError';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserDTO } from '../../types/UserDTO.type';
import { UserMap } from '../../mappers/UserMap';
import { IUserRepo } from '../../repos/UserRepo';
import { IAuthService } from '../services/AuthService';
import { ErrorMap } from '../../../shared/app/error/Error.map';

export interface LoginDTO {
  email: string;
  password: string;
}

interface LoginResult {
  userData: UserDTO;
  authToken: string;
}

interface Input {
  dto: LoginDTO;
}

type Output = Promise<Result<LoginResult>>;

export class LoginUseCase implements UseCase<Input, Output> {
  constructor(private userRepo: IUserRepo, private authService: IAuthService) {}

  async exec({ dto }: Input) {
    try {
      const user = await this.userRepo.getByEmail(dto.email);

      const isPasswordValid = await user.password.validate(dto.password);
      if (!isPasswordValid) return BaseError.badRequest<LoginResult>('Invalid email or password');

      const authToken = this.authService.createToken(user.id);
      const userData = UserMap.entityToDTO(user);

      user.setIsLoggedIn(true);

      return Result.ok<LoginResult>({ userData, authToken });
    } catch (e) {
      if (e instanceof BaseError && e.code === 'NOT_FOUND')
        return BaseError.badRequest<LoginResult>('Invalid email or password');

      return ErrorMap.toUseCase<LoginResult>(e);
    }
  }
}
