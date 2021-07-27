import { prisma } from '../../shared/services/prismaClient';
import { ChatRepo } from './ChatRepo';
import { MessageRepo } from './MessageRepo';

export const chatRepo = new ChatRepo(prisma);
export const messageRepo = new MessageRepo(prisma);
