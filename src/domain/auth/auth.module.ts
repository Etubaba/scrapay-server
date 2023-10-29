import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthResolver } from './resolver/auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthResolver, AuthService, JwtStrategy],
})
export class AuthModule {}
