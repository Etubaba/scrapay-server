import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from '../service/auth.service';
import { AuthResponse } from '../entity/auth.entity';
import { LoginInput } from '../dto/input/login.input';
import { RegisterInput } from '../dto/input/register.input';
import { RefreshTokenInput } from '../dto/input/refreshToken.input';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, {
    name: 'register',
    description: 'SignUp a user',
  })
  async register(@Args('registerInput') registerInput: RegisterInput) {
    return await this.authService.registerUser(registerInput);
  }
  @Mutation(() => AuthResponse, {
    name: 'login',
    description: 'SignIn a user',
  })
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.loginUser(loginInput);
  }
  @Mutation(() => AuthResponse, {
    name: 'refreshtoken',
    description: 'refresh expired access token with refresh token',
  })
  async refreshUserToken(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
  ) {
    return await this.authService.refreshUserToken(refreshTokenInput);
  }
}
