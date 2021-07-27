import { BaseError } from '../../../shared/app/error/BaseError';
import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../../user/domain/UserEntity';
import { ChatMap } from '../../mappers/ChatMap';
import { IChatRepo } from '../../repos/ChatRepo';
import { IMessageRepo } from '../../repos/MessageRepo';
import { ChatDTO } from '../../types/ChatDTOs.type';
import { CreateMessageDTO } from '../../types/ChatDTOs.type';

interface StartChatDTO {
  message: string;
  receiverID: string;
}

interface Input {
  dto: StartChatDTO;
  user: UserEntity;
}

type Output = Promise<Result<ChatDTO>>;

export class StartChatUsecase implements UseCase<Input, Output> {
  constructor(private chatRepo: IChatRepo, private messageRepo: IMessageRepo) {}

  async exec({ dto, user }: Input) {
    try {
      if (await this.chatRepo.existByReceiver(dto.receiverID))
        return BaseError.badRequest<ChatDTO>('Chat already exists');

      const chat = await this.chatRepo.create();

      const messageInput: CreateMessageDTO = {
        chatID: chat.id,
        message: dto.message,
        senderID: user.id,
        receiverID: dto.receiverID,
      };

      await this.messageRepo.create(messageInput);

      const updatedChat = await this.chatRepo.getById(chat.id);

      return Result.ok<ChatDTO>(ChatMap.entityToDTO(updatedChat));
    } catch (e) {
      return ErrorMap.toUseCase<ChatDTO>(e);
    }
  }
}
