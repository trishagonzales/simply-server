import {
  Arg,
  Ctx,
  Mutation,
  Publisher,
  PubSub,
  Subscription,
  UseMiddleware,
  Resolver,
  Root,
} from 'type-graphql';
import { Auth, ContextWithUser } from '../../../shared/web/middlewares/AuthMiddleware';
import { reply } from '../../app/usecases';
import { Message } from '../schema/ChatSchema';

@Resolver()
export class MessageResolver {
  @UseMiddleware(Auth)
  @Mutation(() => Message)
  async reply(
    @Arg('message') message: string,
    @Arg('chatID') chatID: string,
    @PubSub('NEW_MESSAGE') publish: Publisher<Message>,
    @Ctx() { user }: ContextWithUser
  ): Promise<Message> {
    const dto = { message, chatID };

    const res = await reply.exec({ dto, user });
    if (!res.isSuccess) throw res.error;

    publish(res.value);

    return res.value;
  }

  @UseMiddleware(Auth)
  @Subscription(() => Message, { topics: 'NEW_MESSAGE' })
  async newMessage(@Root() messagePayload: Message): Promise<Message> {
    return messagePayload;
  }
}
