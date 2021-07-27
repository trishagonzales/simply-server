import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  PubSub,
  Publisher,
  Root,
  UseMiddleware,
  Query,
  FieldResolver,
  Args,
} from 'type-graphql';
import _ from 'lodash';
import { Auth, ContextWithUser } from '../../../shared/web/middlewares/AuthMiddleware';
import { PaginateArgs } from '../../../shared/web/schema/args/PaginateArgs';
import { getOneMyChat, getAllMyChats, startChat } from '../../app/usecases';
import { Chat, Message } from '../schema/ChatSchema';
import { PageUtil } from '../../../shared/utils/PageUtil';

@Resolver(() => Chat)
export class ChatResolver {
  @UseMiddleware(Auth)
  @FieldResolver(() => [Message])
  async messages(
    @Root() { messages }: Chat,
    @Args() { take, skip }: PaginateArgs
  ): Promise<Message[]> {
    return PageUtil.paginate<Message>(messages, { take, skip });
  }

  @UseMiddleware(Auth)
  @Query(() => Chat)
  async chat(@Arg('id') id: string): Promise<Chat> {
    const res = await getOneMyChat.exec({ id });
    if (!res.isSuccess) throw res.error;

    return res.value;
  }

  @UseMiddleware(Auth)
  @Query(() => [Chat])
  async chats(@Ctx() { user }: ContextWithUser): Promise<Chat[]> {
    const res = await getAllMyChats.exec({ user });
    if (!res.isSuccess) throw res.error;

    return res.value;
  }

  @UseMiddleware(Auth)
  @Mutation(() => Chat)
  async startChat(
    @Arg('message') message: string,
    @Arg('receiverID') receiverID: string,
    @PubSub('NEW_MESSAGE') publish: Publisher<Message>,
    @Ctx() { user }: ContextWithUser
  ): Promise<Chat> {
    const dto = { message, receiverID };

    const res = await startChat.exec({ dto, user });
    if (!res.isSuccess) throw res.error;

    publish(res.value.messages[0]);

    return res.value;
  }
}
