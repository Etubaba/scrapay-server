import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @Field()
  @IsNotEmpty()
  @MaxLength(7)
  password: string;
}
