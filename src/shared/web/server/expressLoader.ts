import cookieParser from 'cookie-parser';
import express from 'express';
import { logger } from '../../utils/logger';

const log = logger.extend('express-loader');

export function expressLoader() {
  try {
    const app = express();

    app.use(cookieParser());

    return app;
  } catch (e) {
    log('Failed to load express');
    log(e);
  }
}
