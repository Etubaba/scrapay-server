import { IsNotEmpty } from 'class-validator';
import { LoginInput } from './login.input';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput extends LoginInput {
  @Field()
  @IsNotEmpty()
  full_name: string;
}
