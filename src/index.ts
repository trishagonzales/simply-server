import 'reflect-metadata';
import dotenv from 'dotenv';
import { startServer } from './shared/web/server';

dotenv.config();

startServer();
