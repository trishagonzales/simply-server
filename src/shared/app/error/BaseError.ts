import { logger } from '../../utils/logger';
import { IError } from './IError';
import { Result } from '../Result';

export type BaseErrorCode =
  | 'UNEXPECTED'
  | 'BAD_REQUEST'
  | 'UNAUTHENTICATED'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT';

export class BaseError implements IError<BaseErrorCode> {
  constructor(public code: BaseErrorCode, public msg?: string) {}

  public static unexpected<T>(err: any) {
    logger(err);
    return Result.fail<T, BaseError>(new BaseError('UNEXPECTED', 'Unexpected error occurred'));
  }

  public static badRequest<T>(msg?: string) {
    return Result.fail<T>(new BaseError('BAD_REQUEST', msg));
  }

  public static unauthenticated<T>(msg?: string) {
    return Result.fail<T>(new BaseError('UNAUTHENTICATED', msg));
  }

  public static unauthorized<T>(msg?: string) {
    return Result.fail<T>(new BaseError('UNAUTHORIZED', msg));
  }

  public static notFound<T>(msg?: string) {
    return Result.fail<T>(new BaseError('NOT_FOUND', msg));
  }

  public static conflict<T>(msg?: string) {
    return Result.fail<T>(new BaseError('CONFLICT', msg));
  }
}
