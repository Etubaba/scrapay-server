import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from '../service/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/service/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        AuthService,
        PrismaService,
        JwtService,
        ConfigService,
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  const mockUser = {
    id: 47,
    email: 'prosper@gmail.com',
    password: '1234567',
    full_name: 'prosper',
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  describe('login', () => {
    it('should call the authService.login method with the provided credentials', async () => {
      const loginDto = {
        password: '1234567',
        email: 'prosper@gmail.com',
      };

      authService.loginUser = jest.fn().mockResolvedValueOnce(mockUser);

      const result = await resolver.login(loginDto);

      expect(authService.loginUser).toHaveBeenCalledWith(loginDto);
      expect(result).toBe(mockUser);
    });
  });

  describe('register', () => {
    it('should call the authService.register method with the provided Dto', async () => {
      const registerDto = {
        password: '12345',
        email: 'mala@gmail.com',
        full_name: 'Michael Angel',
      };

      authService.registerUser = jest.fn().mockResolvedValueOnce(mockUser);
      const result = await resolver.register(registerDto);

      expect(authService.registerUser).toHaveBeenCalledWith(registerDto);
      expect(result).toBe(mockUser);
    });
  });

  describe('refreshToken', () => {
    it('should call the authService.refreshToken method with the provided refreshTokenDto', async () => {
      const refreshTokenDto = {
        token: 'remdwknwjkjkjnwdlwlmwklk',
      };

      authService.refreshUserToken = jest.fn().mockResolvedValueOnce(mockUser);

      const result = await resolver.refreshUserToken(refreshTokenDto);

      expect(authService.refreshUserToken).toHaveBeenCalledWith(
        refreshTokenDto,
      );
      expect(result).toBe(mockUser);
    });
  });
});
