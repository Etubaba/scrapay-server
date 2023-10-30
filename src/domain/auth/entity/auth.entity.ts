import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field(() => Number)
  id: number;
  @Field(() => String)
  full_name: String;
  @Field(() => String)
  accessToken: string;
  @Field(() => String)
  refreshToken: string;
  // platform: String;
}
