import { Resolver, Mutation, Arg, Query, Ctx, UseMiddleware } from 'type-graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import {
  deleteAccount,
  deleteAvatar,
  getUserData,
  updateAvatar,
  updateEmail,
  updateName,
  updatePassword,
} from '../../app/usecases';
import { User } from '../schema/UserSchema';
import { Auth, ContextWithUser } from '../../../shared/web/middlewares/AuthMiddleware';
import { cookieConfig } from '../../../shared/web/serverConfigs/express.config';

@Resolver()
export class AccountResolver {
  // GET USER DATA
  @UseMiddleware(Auth)
  @Query(() => User)
  async me(@Ctx() { user }: ContextWithUser): Promise<User> {
    const res = await getUserData.exec({ user });
    if (!res.isSuccess) throw res.error;

    return res.value;
  }

  // UPDATE NAME
  @UseMiddleware(Auth)
  @Mutation(() => String)
  async updateName(@Arg('name') name: string, @Ctx() { user }: ContextWithUser): Promise<string> {
    const res = await updateName.exec({ name, user });
    if (!res.isSuccess) throw res.error;

    return res.value;
  }

  // UPDATE EMAIL
  @UseMiddleware(Auth)
  @Mutation(() => String)
  async updateEmail(
    @Arg('email') email: string,
    @Ctx() { user }: ContextWithUser
  ): Promise<string> {
    const res = await updateEmail.exec({ email, user });
    if (!res.isSuccess) throw res.error;

    return res.value;
  }

  // UPDATE PASSWORD
  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  async updatePassword(
    @Arg('password') password: string,
    @Ctx() { user }: ContextWithUser
  ): Promise<boolean> {
    const res = await updatePassword.exec({ password, user });
    if (!res.isSuccess) throw res.error;

    return true;
  }

  // UPDATE AVATAR
  @UseMiddleware(Auth)
  @Mutation(() => String)
  async updateAvatar(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @Ctx() { user }: ContextWithUser
  ): Promise<string> {
    const res = await updateAvatar.exec({ file, user });
    if (!res.isSuccess) throw res.error;

    return res.value;
  }

  // DELETE AVATAR
  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  async deleteAvatar(@Ctx() { user }: ContextWithUser): Promise<boolean> {
    const res = await deleteAvatar.exec({ user });
    if (!res.isSuccess) throw res.error;

    return true;
  }

  // DELETE ACCOUNT
  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  async deleteAccount(@Ctx() ctx: ContextWithUser): Promise<boolean> {
    const res = await deleteAccount.exec({ user: ctx.user });
    if (!res.isSuccess) throw res.error;

    ctx.res.clearCookie(cookieConfig.name);

    return true;
  }
}
