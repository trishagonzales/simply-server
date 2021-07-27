import { ApolloServerExpressConfig } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';

export function generateServerConfig(schema: GraphQLSchema): ApolloServerExpressConfig {
  return {
    schema,
    context: ({ req, res }) => ({ req, res }),
  };
}
