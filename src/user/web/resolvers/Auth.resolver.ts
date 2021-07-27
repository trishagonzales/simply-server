import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { Auth, ContextWithUser } from '../../../shared/web/middlewares/AuthMiddleware';
import { cookieConfig } from '../../../shared/web/serverConfigs/express.config';
import { login, signup, validatePassword } from '../../app/usecases';
import { LoginInput, SignupInput, User } from '../schema/UserSchema';

@Resolver()
export class AuthResolver {
  // SIGNUP
  @Mutation(() => User)
  async signup(@Arg('input') input: SignupInput, @Ctx() ctx: ContextWithUser): Promise<User> {
    const res = await signup.exec({ dto: input });
    if (!res.isSuccess) throw res.error;

    ctx.res.cookie(cookieConfig.name, res.value.authToken, cookieConfig.options);

    return res.value.userData;
  }

  // LOGIN
  @Mutation(() => User)
  async login(@Arg('input') input: LoginInput, @Ctx() ctx: ContextWithUser): Promise<User> {
    const res = await login.exec({ dto: input });
    if (!res.isSuccess) throw res.error;

    ctx.res.cookie(cookieConfig.name, res.value.authToken, cookieConfig.options);

    return res.value.userData;
  }

  // LOGOUT
  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: ContextWithUser): Promise<boolean> {
    ctx.res.clearCookie(cookieConfig.name);
    return true;
  }

  // VALIDATE PASSWORD
  @UseMiddleware(Auth)
  @Mutation(() => Boolean)
  async validatePassword(
    @Arg('password') password: string,
    @Ctx() { user }: ContextWithUser
  ): Promise<boolean> {
    const res = await validatePassword.exec({ password, user });
    if (!res.isSuccess) throw res.error;

    return res.value;
  }
}
