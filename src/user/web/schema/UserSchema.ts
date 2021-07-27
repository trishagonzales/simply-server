import { ObjectType, Field, ID, InputType } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID!)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  dateCreated: Date;

  @Field({ nullable: true })
  avatarUrl?: string;
}

@InputType()
export class SignupInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
