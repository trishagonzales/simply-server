export interface ChatDTO {
  id: string;
  messages: MessageDTO[];
}

export interface PublicUserDTO {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface MessageDTO {
  id: string;
  message: string;
  chatID: string;
  sender: PublicUserDTO;
  receiver: PublicUserDTO;
  dateCreated: Date;
}

export interface CreateMessageDTO {
  message: string;
  chatID: string;
  senderID: string;
  receiverID: string;
}

export interface ReplyDTO {
  message: string;
  chatID: string;
}
