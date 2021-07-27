import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Chat {
  @Field(() => ID!)
  id: string;

  @Field(() => [Message])
  messages: Message[];
}

@ObjectType()
export class PublicUser {
  @Field(() => ID!)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  avatarUrl?: string;
}

@ObjectType()
export class Message {
  @Field(() => ID!)
  id: string;

  @Field()
  message: string;

  @Field()
  dateCreated: Date;

  @Field(() => PublicUser)
  sender: PublicUser;

  @Field(() => PublicUser)
  receiver: PublicUser;
}
