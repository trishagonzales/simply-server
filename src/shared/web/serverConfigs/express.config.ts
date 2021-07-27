import { CookieOptions } from 'express';
import { config } from '../../utils/config';

interface CookieConfig {
  name: string;
  options: CookieOptions;
}

export const cookieConfig: CookieConfig = {
  name: 'cid',
  options: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 100,
    secure: config.NODE_ENV === 'production',
  },
};
