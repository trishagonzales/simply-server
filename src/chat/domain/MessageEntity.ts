import { BaseError } from '../../shared/app/error/BaseError';
import { Guard } from '../../shared/app/Guard';
import { Result } from '../../shared/app/Result';
import { Entity } from '../../shared/domain/Entity';

export interface PublicUserProps {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface MessageProps {
  id: string;
  message: string;
  chatID: string;
  sender: PublicUserProps;
  receiver: PublicUserProps;
  dateCreated: Date;
}

export class MessageEntity extends Entity<MessageProps> {
  private constructor(props: MessageProps) {
    super(props);
  }

  get id() {
    return this.props.id;
  }
  get message() {
    return this.props.message;
  }
  get chatID() {
    return this.props.chatID;
  }
  get dateCreated() {
    return this.props.dateCreated;
  }
  get sender() {
    return this.props.sender;
  }
  get receiver() {
    return this.props.receiver;
  }

  static create(props: MessageProps) {
    const propsGuard = Guard.nullOrUndefinedList(Object.values(props));
    if (!propsGuard.isSuccess) return BaseError.unexpected<MessageEntity>(propsGuard.message);

    return Result.ok<MessageEntity>(new MessageEntity(props));
  }
}
