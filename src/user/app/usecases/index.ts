import { userRepo } from '../../repos';
import { authService, imgService } from '../services';
import { DeleteAccountUsecase } from './deleteAccount.usecase';
import { DeleteAvatarUsecase } from './deleteAvatar.usecase';
import { GetAllUsersUsecase } from './getAllUsers.usecase';
import { GetOneUserUsecase } from './getOneUser.usecase';
import { GetUserDataUseCase } from './getUserData.usecase';
import { LoginUseCase } from './login.usecase';
import { SignupUsecase } from './signup.usecase';
import { UpdateAvatarUsecase } from './updateAvatar.usecase';
import { UpdateEmailUsecase } from './updateEmail.usecase';
import { UpdateNameUsecase } from './updateName.usecase';
import { UpdatePasswordUsecase } from './updatePassword.usecase';
import { ValidatePasswordUseCase } from './validatePassword.usecase';

export const signup = new SignupUsecase(userRepo, authService);
export const login = new LoginUseCase(userRepo, authService);

export const getUserData = new GetUserDataUseCase();
export const validatePassword = new ValidatePasswordUseCase();
export const updateName = new UpdateNameUsecase(userRepo);
export const updateEmail = new UpdateEmailUsecase(userRepo);
export const updatePassword = new UpdatePasswordUsecase(userRepo);
export const deleteAccount = new DeleteAccountUsecase(userRepo);

export const updateAvatar = new UpdateAvatarUsecase(userRepo, imgService);
export const deleteAvatar = new DeleteAvatarUsecase(userRepo, imgService);

export const getOneUser = new GetOneUserUsecase(userRepo);
export const getAllUsers = new GetAllUsersUsecase(userRepo);
