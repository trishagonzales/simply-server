import { logger } from '../utils/logger';
import { BaseError } from './error/BaseError';

export class Result<T, U = BaseError> {
  public readonly error?: U;
  private readonly _value: T;

  private constructor(public isSuccess: boolean, error?: U, value?: T) {
    if (isSuccess) this._value = value as T;
    if (!isSuccess) this.error = error;

    Object.freeze(this);
  }

  get value() {
    if (!this.isSuccess) {
      logger(this.error);
      console.trace();
      throw `Value not available. Operation resulted in error. Access error property instead.`;
    }

    return this._value;
  }

  public static ok<A>(value?: A) {
    return new Result<A>(true, undefined, value);
  }

  public static fail<A, B = BaseError>(error: B) {
    return new Result<A, B>(false, error);
  }
}
