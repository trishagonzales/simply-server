import { AuthenticationError } from 'apollo-server-express';
import { Request, Response } from 'express';
import { MiddlewareFn } from 'type-graphql';
import { authService } from '../../../user/app/services';
import { UserEntity } from '../../../user/domain/UserEntity';

export interface Context {
  req: Request;
  res: Response;
}

export interface ContextWithUser extends Context {
  user: UserEntity;
}

export const Auth: MiddlewareFn<ContextWithUser> = async ({ context }, next) => {
  const token = context.req.cookies.cid;
  if (!token) throw new AuthenticationError('Login required');

  const userOrError = await authService.getUserFromToken(token);
  if (!userOrError.isSuccess) throw userOrError.error;

  const user = userOrError.value;
  user.setIsLoggedIn(true);
  context.user = user;

  return next();
};
