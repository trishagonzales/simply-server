import { Message as MessageModel } from '@prisma/client';
import { Result } from '../../shared/app/Result';
import { MessageEntity, PublicUserProps } from '../domain/MessageEntity';
import { MessageDTO } from '../types/ChatDTOs.type';

export class MessageMap {
  static entityToDTO(message: MessageEntity): MessageDTO {
    const { id, chatID, dateCreated, sender, receiver } = message;

    const dto: MessageDTO = {
      id,
      message: message.message,
      chatID: chatID,
      sender,
      receiver,
      dateCreated,
    };

    return dto;
  }

  static persistenceToDomain(
    data: MessageModel,
    sender: PublicUserProps,
    receiver: PublicUserProps
  ): Result<MessageEntity> {
    const { id, message, chatId, dateCreated } = data;

    return MessageEntity.create({
      id,
      message,
      chatID: chatId,
      dateCreated,
      sender,
      receiver,
    });
  }
}
