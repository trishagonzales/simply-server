import { buildSchema } from 'type-graphql';
import { ExceptionFilter } from '../middlewares/ExceptionFilterMiddleware';

export async function buildGQLSchema() {
  const schema = await buildSchema({
    resolvers: [process.cwd() + '/**/*.resolver.ts'],
    globalMiddlewares: [ExceptionFilter],
  });

  return schema;
}
