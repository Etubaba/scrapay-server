import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponseOutput {
  @Field()
  id: number;

  @Field()
  full_name: number;
  //   @Field()
  //   accessToken: string;

  //   @Field()
  //   refreshToken: string;
}
