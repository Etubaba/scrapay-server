import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthResolver } from './resolver/auth.resolver';

@Module({
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
