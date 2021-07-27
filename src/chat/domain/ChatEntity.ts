import { BaseError } from '../../shared/app/error/BaseError';
import { Guard } from '../../shared/app/Guard';
import { Result } from '../../shared/app/Result';
import { Entity } from '../../shared/domain/Entity';
import { UserEntity } from '../../user/domain/UserEntity';
import { MessageEntity } from './MessageEntity';

interface ChatProps {
  id: string;
  messages: MessageEntity[];
}

export class ChatEntity extends Entity<ChatProps> {
  private constructor(props: ChatProps) {
    super(props);
  }

  get id() {
    return this.props.id;
  }
  get messages() {
    return this.props.messages;
  }

  private userIDs(): string[] {
    return [this.messages[0].sender.id, this.messages[0].receiver.id];
  }

  getReceiverID(user: UserEntity): string {
    return this.userIDs().filter(id => id !== user.id)[0];
  }

  static create(props: ChatProps) {
    const propsGuard = Guard.nullOrUndefinedList(Object.values(props));
    if (!propsGuard.isSuccess) return BaseError.unexpected<ChatEntity>(propsGuard.message);

    return Result.ok<ChatEntity>(new ChatEntity(props));
  }
}
