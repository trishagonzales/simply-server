import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../../user/domain/UserEntity';
import { MessageMap } from '../../mappers/MessageMap';
import { IChatRepo } from '../../repos/ChatRepo';
import { IMessageRepo } from '../../repos/MessageRepo';
import { MessageDTO, ReplyDTO } from '../../types/ChatDTOs.type';

interface Input {
  dto: ReplyDTO;
  user: UserEntity;
}

type Output = Promise<Result<MessageDTO>>;

export class ReplyUsecase implements UseCase<Input, Output> {
  constructor(private chatRepo: IChatRepo, private messageRepo: IMessageRepo) {}

  async exec({ dto: { message, chatID }, user }: Input) {
    try {
      const chat = await this.chatRepo.getById(chatID);

      const messageEntity = await this.messageRepo.create({
        message,
        chatID,
        senderID: user.id,
        receiverID: chat.getReceiverID(user),
      });

      return Result.ok<MessageDTO>(MessageMap.entityToDTO(messageEntity));
    } catch (e) {
      return ErrorMap.toUseCase<MessageDTO>(e);
    }
  }
}
