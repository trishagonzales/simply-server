import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import { BaseError } from './BaseError';

export class ErrorMap {
  public static toWebAPI(err: any) {
    if (err instanceof ApolloError) throw err;

    if (err instanceof BaseError)
      switch (err.code) {
        case 'BAD_REQUEST':
        case 'CONFLICT':
          throw new UserInputError(err.msg ?? '');

        case 'NOT_FOUND':
          throw new ApolloError(err.msg ?? '', 'NOT_FOUND');

        case 'UNAUTHENTICATED':
          throw new AuthenticationError(err.msg ?? '');

        case 'UNAUTHORIZED':
          throw new ForbiddenError(err.msg ?? '');

        case 'UNEXPECTED':
          throw new ApolloError(err.msg ?? 'Unexpected error occurred', 'INTERNAL_SERVER_ERROR');

        default:
          throw new ApolloError(err.msg ?? '', err.code ?? 'INTERNAL_SERVER_ERROR');
      }

    throw new ApolloError(err.msg ?? '', 'INTERNAL_SERVER_ERROR');
  }

  public static toUseCase<T>(err: any) {
    if (err instanceof BaseError) {
      switch (err.code) {
        case 'BAD_REQUEST':
          return BaseError.badRequest<T>(err.msg);

        case 'CONFLICT':
          return BaseError.conflict<T>(err.msg);

        case 'NOT_FOUND':
          return BaseError.notFound<T>(err.msg);

        case 'UNAUTHENTICATED':
          return BaseError.unauthenticated<T>(err.msg);

        case 'UNAUTHORIZED':
          return BaseError.unauthorized<T>(err.msg);

        default:
          return BaseError.unexpected<T>(err);
      }
    } else {
      return BaseError.unexpected<T>(err);
    }
  }
}
