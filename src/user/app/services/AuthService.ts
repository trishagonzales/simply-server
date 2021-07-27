import jwt from 'jsonwebtoken';
import { BaseError } from '../../../shared/app/error/BaseError';
import { Result } from '../../../shared/app/Result';
import { config } from '../../../shared/utils/config';
import { logger } from '../../../shared/utils/logger';
import { UserEntity } from '../../domain/UserEntity';
import { IUserRepo } from '../../repos/UserRepo';

const log = logger.extend('auth-service');

export interface TokenPayload {
  userID: string;
}

export interface IAuthService {
  getUserFromToken: (token: string) => Promise<Result<UserEntity>>;
  getUserIDFromToken: (token: string) => Promise<string>;
  createToken: (userID: string) => string;
}

export class AuthService implements IAuthService {
  constructor(private userRepo: IUserRepo) {}

  async getUserFromToken(token: string) {
    try {
      const id = await this.getUserIDFromToken(token);
      const user = await this.userRepo.getById(id);

      return Result.ok<UserEntity>(user);
    } catch (e) {
      return e;
    }
  }

  async getUserIDFromToken(token: string) {
    return new Promise<string>((resolve, reject) => {
      jwt.verify(token, config.JWT_KEY!, (err, decoded) => {
        if (err) reject(BaseError.unauthenticated<UserEntity>('Access denied'));
        if (!decoded) reject(BaseError.unauthenticated<UserEntity>('Access denied'));

        resolve((decoded as TokenPayload).userID);
      });
    });
  }

  createToken(userID: string) {
    return jwt.sign({ userID }, config.JWT_KEY!, { expiresIn: '30d' });
  }
}
