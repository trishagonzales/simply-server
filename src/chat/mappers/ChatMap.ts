import { Result } from '../../shared/app/Result';
import { ChatEntity } from '../domain/ChatEntity';
import { ChatDTO } from '../types/ChatDTOs.type';
import { ChatWithMessagesModel } from '../types/ChatModel.type';
import { MessageMap } from './MessageMap';
import { PublicUserMap } from './PublicUserMap';

export class ChatMap {
  static persistenceToDomain(chat: ChatWithMessagesModel): Result<ChatEntity> {
    const messages = chat.messages.map(message => {
      const sender = PublicUserMap.peristenceToDomain(message.sender);
      const receiver = PublicUserMap.peristenceToDomain(message.receiver);

      return MessageMap.persistenceToDomain(message, sender, receiver).value;
    });

    return ChatEntity.create({ id: chat.id, messages });
  }

  static entityToDTO({ id, messages }: ChatEntity): ChatDTO {
    return {
      id,
      messages: messages.map(msg => MessageMap.entityToDTO(msg)),
    };
  }
}
