import { config } from '../../utils/config';
import { logger } from '../../utils/logger';
import { apolloLoader } from './apolloLoader';
import { expressLoader } from './expressLoader';

const log = logger.extend('server');

export async function startServer() {
  try {
    const app = expressLoader();

    if (app) {
      const server = await apolloLoader(app);

      return server?.listen(config.PORT, () => log(`App started at ${config.BACKEND_URL}`));
    }
  } catch (e) {
    log(e);
  }
}
