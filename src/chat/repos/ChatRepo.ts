import { PrismaClient } from '@prisma/client';
import { BaseError } from '../../shared/app/error/BaseError';
import { ChatEntity } from '../domain/ChatEntity';
import { ChatMap } from '../mappers/ChatMap';

export interface IChatRepo {
  existById: (id: string) => Promise<boolean>;
  existByReceiver: (receiverID: string) => Promise<boolean>;
  create: () => Promise<ChatEntity>;

  getById: (id: string) => Promise<ChatEntity>;
  getAllByUser: (userID: string) => Promise<ChatEntity[]>;
}

export class ChatRepo implements IChatRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async existById(id: string) {
    const chat = await this.prisma.chat.findUnique({ where: { id } });
    return !!chat;
  }

  async existByReceiver(receiverID: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        messages: {
          some: { OR: [{ receiver: { id: receiverID } }, { sender: { id: receiverID } }] },
        },
      },
    });
    return !!chats.length;
  }

  async create() {
    const chat = await this.prisma.chat.create({
      data: {},
      include: {
        messages: {
          include: {
            sender: { include: { avatar: true } },
            receiver: { include: { avatar: true } },
          },
        },
      },
    });

    const chatOrError = ChatMap.persistenceToDomain(chat);
    if (!chatOrError.isSuccess) throw chatOrError.error;

    return chatOrError.value;
  }

  async getById(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        messages: {
          include: {
            sender: { include: { avatar: true } },
            receiver: { include: { avatar: true } },
          },
        },
      },
    });
    if (!chat) throw BaseError.notFound<ChatEntity>('Chat not found');

    const chatOrError = ChatMap.persistenceToDomain(chat);
    if (!chatOrError.isSuccess) throw chatOrError.error;

    return chatOrError.value;
  }

  async getAllByUser(senderID: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        messages: { every: { OR: [{ sender: { id: senderID } }, { receiver: { id: senderID } }] } },
      },
      include: {
        messages: {
          include: {
            sender: { include: { avatar: true } },
            receiver: { include: { avatar: true } },
          },
        },
      },
    });

    const chatEntities = chats.map(chat => {
      const chatOrError = ChatMap.persistenceToDomain(chat);
      if (!chatOrError.isSuccess) throw chatOrError.error;

      return chatOrError.value;
    });

    return chatEntities;
  }
}
