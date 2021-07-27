import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class PaginateArgs {
  @Field({ nullable: true })
  take?: number;

  @Field({ nullable: true })
  skip?: number;
}
