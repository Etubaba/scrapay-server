import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field(() => Number)
  id: number;
  @Field(() => String)
  full_name: String;
  // @Field(() => String)
  // platform: String;
}
