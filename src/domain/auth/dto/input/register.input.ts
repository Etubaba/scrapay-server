import { IsString, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
import { LoginDto } from './login.input';

export class RegisterDto extends LoginDto {
  @IsNotEmpty()
  full_name: string;
}
