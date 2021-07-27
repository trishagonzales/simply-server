import { MiddlewareFn } from 'type-graphql';
import { ErrorMap } from '../../app/error/Error.map';

export const ExceptionFilter: MiddlewareFn<any> = async (_, next) => {
  try {
    return await next();
  } catch (e) {
    return ErrorMap.toWebAPI(e);
  }
};
