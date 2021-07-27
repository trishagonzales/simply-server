import { prisma } from '../../shared/services/prismaClient';
import { UserRepo } from './UserRepo';

export const userRepo = new UserRepo(prisma);
