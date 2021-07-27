import { chatRepo, messageRepo } from '../../repos';
import { GetMyChatUsecase } from './getOneMyChat.usecase';
import { GetAllMyChatsUsecase } from './getAllMyChats.usecase';
import { ReplyUsecase } from './reply.usecase';
import { StartChatUsecase } from './startChat.usecase';

export const startChat = new StartChatUsecase(chatRepo, messageRepo);
export const reply = new ReplyUsecase(chatRepo, messageRepo);

export const getOneMyChat = new GetMyChatUsecase(chatRepo);
export const getAllMyChats = new GetAllMyChatsUsecase(chatRepo);
