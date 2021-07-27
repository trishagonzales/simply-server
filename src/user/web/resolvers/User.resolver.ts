import { Resolver, Query, Arg } from 'type-graphql';
import { getAllUsers, getOneUser } from '../../app/usecases';
import { User } from '../schema/UserSchema';

@Resolver()
export class UserResolver {
  @Query(() => User)
  async user(@Arg('id') id: string): Promise<User> {
    const res = await getOneUser.exec({ id });
    if (!res.isSuccess) throw res.error;

    return res.value;
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    const res = await getAllUsers.exec();
    if (!res.isSuccess) throw res.error;

    return res.value;
  }
}
