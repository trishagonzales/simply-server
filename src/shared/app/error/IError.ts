import { BaseErrorCode } from './BaseError';

export interface IError<T = BaseErrorCode> {
  code: T;
  msg?: string;
}
