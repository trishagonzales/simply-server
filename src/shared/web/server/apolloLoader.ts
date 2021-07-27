import { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';

import { generateServerConfig } from '../serverConfigs/apolloServer.config';
import { buildGQLSchema } from '../serverConfigs/typegraphql.config';
import { config } from '../../utils/config';
import { logger } from '../../utils/logger';

const log = logger.extend('apollo-loader');

export async function apolloLoader(app: Express) {
  try {
    const schema = await buildGQLSchema();
    const serverConfig = generateServerConfig(schema);

    const apolloServer = new ApolloServer(serverConfig);

    apolloServer.applyMiddleware({
      app,
      cors: {
        origin: config.FRONTEND_URL,
        credentials: true,
      },
    });

    const httpServer = createServer(app);
    apolloServer.installSubscriptionHandlers(httpServer);

    return httpServer;
  } catch (e) {
    log('Failed to load Apollo Server');
    log(e);
  }
}
