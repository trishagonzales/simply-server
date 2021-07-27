import { ErrorMap } from '../../../shared/app/error/Error.map';
import { Result } from '../../../shared/app/Result';
import { UseCase } from '../../../shared/app/UseCase';
import { ChatMap } from '../../mappers/ChatMap';
import { IChatRepo } from '../../repos/ChatRepo';
import { ChatDTO } from '../../types/ChatDTOs.type';

interface Input {
  id: string;
}

type Output = Promise<Result<ChatDTO>>;

export class GetMyChatUsecase implements UseCase<Input, Output> {
  constructor(private chatRepo: IChatRepo) {}

  async exec({ id }: Input) {
    try {
      const chat = await this.chatRepo.getById(id);

      return Result.ok<ChatDTO>(ChatMap.entityToDTO(chat));
    } catch (e) {
      return ErrorMap.toUseCase<ChatDTO>(e);
    }
  }
}
