import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { UserEntity } from '../../../user/domain/UserEntity';
import { ChatMap } from '../../mappers/ChatMap';
import { IChatRepo } from '../../repos/ChatRepo';
import { ChatDTO } from '../../types/ChatDTOs.type';

interface Input {
  user: UserEntity;
}

type Output = Promise<Result<ChatDTO[]>>;

export class GetAllMyChatsUsecase implements UseCase<Input, Output> {
  constructor(private chatRepo: IChatRepo) {}

  async exec({ user }: Input) {
    try {
      const chats = await this.chatRepo.getAllByUser(user.id);

      return Result.ok<ChatDTO[]>(chats.map(chat => ChatMap.entityToDTO(chat)));
    } catch (e) {
      return ErrorMap.toUseCase<ChatDTO[]>(e);
    }
  }
}
