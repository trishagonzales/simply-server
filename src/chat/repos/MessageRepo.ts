import { PrismaClient } from '@prisma/client';
import { BaseError } from '../../shared/app/error/BaseError';
import { MessageEntity } from '../domain/MessageEntity';
import { MessageMap } from '../mappers/MessageMap';
import { PublicUserMap } from '../mappers/PublicUserMap';
import { CreateMessageDTO } from '../types/ChatDTOs.type';

export interface IMessageRepo {
  exist: (id: string) => Promise<boolean>;
  create: (dto: CreateMessageDTO) => Promise<MessageEntity>;

  getById: (id: string) => Promise<MessageEntity>;
  deleteById: (id: string) => Promise<void>;
}

export class MessageRepo implements IMessageRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async exist(id: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    return !!message;
  }

  async create(dto: CreateMessageDTO) {
    const message = await this.prisma.message.create({
      data: {
        message: dto.message,
        chatId: dto.chatID,
        senderId: dto.senderID,
        receiverId: dto.receiverID,
      },
      include: { sender: { include: { avatar: true } }, receiver: { include: { avatar: true } } },
    });

    const sender = PublicUserMap.peristenceToDomain(message.sender);
    const receiver = PublicUserMap.peristenceToDomain(message.receiver);

    const messageOrError = MessageMap.persistenceToDomain(message, sender, receiver);
    if (!messageOrError.isSuccess) throw messageOrError.error;

    return messageOrError.value;
  }

  async getById(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: { sender: { include: { avatar: true } }, receiver: { include: { avatar: true } } },
    });
    if (!message) throw BaseError.notFound<MessageEntity>('Message not found');

    const sender = PublicUserMap.peristenceToDomain(message.sender);
    const receiver = PublicUserMap.peristenceToDomain(message.receiver);

    const messageOrError = MessageMap.persistenceToDomain(message, sender, receiver);
    if (!messageOrError.isSuccess) throw messageOrError.error;

    return messageOrError.value;
  }

  async deleteById(id: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) throw BaseError.notFound<boolean>('Message not found');

    await this.prisma.message.delete({ where: { id } });
  }
}
