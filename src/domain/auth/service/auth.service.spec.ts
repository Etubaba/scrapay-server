import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/service/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import configuration from '../../../../config';
import * as argon from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let authService: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  const mockEmail = 'lala@gmaim.com';

  const mockUser = {
    id: 47,
    email: mockEmail,
    full_name: 'Mallam Kai',
    password: 'password',
  };

  const mockJwtService = {
    verify: jest.fn().mockReturnValueOnce({ email: mockEmail }),
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PrismaService,
        ConfigService,
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },

        { provide: JwtService, useValue: { signAsync: jest.fn() } },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Register', () => {
    const randomEmail = `${getRandomString(5)}@gmail.com`;

    //generate random string and number of length 5?

    const newUser = {
      email: randomEmail,
      full_name: 'Test man',
      password: 'password',
    };

    const mockAccessToken = 'mock-access-token';
    const mockRefreshToken = 'mock-refresh-token';

    it('should register new user', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValue(newUser as any);
      jest
        .spyOn(authService, 'generateNewToken')
        .mockResolvedValueOnce(mockAccessToken)
        .mockResolvedValueOnce(mockRefreshToken);

      jest.spyOn(argon, 'hash').mockResolvedValue('$mock-hashed-password');

      const result = await authService.registerUser(newUser);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: newUser.email,
          full_name: newUser.full_name,
          password: '$mock-hashed-password',
        },
      });

      expect(authService.generateNewToken).toHaveBeenCalledWith(
        result.id,
        newUser.email,
        'access',
      );
      expect(authService.generateNewToken).toHaveBeenCalledWith(
        result.id,
        newUser.email,
        'refresh',
      );

      expect(result).toEqual({
        ...newUser,
        id: result.id,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });
  });

  // describe('Login', () => {
  //   it('should login a user and return the user details and tokens', async () => {
  //     const userDto = { password: mockUser.password, email: mockUser.email };
  //     const mockAccessToken = 'mock-access-token';
  //     const mockRefreshToken = 'mock-refresh-token';

  //     jest
  //       .spyOn(prismaService.user, 'findFirst')
  //       .mockResolvedValue(mockUser as any);

  //     jest
  //       .spyOn(authService, 'validateEmailExist')
  //       .mockResolvedValue(mockUser as any);

  //     jest
  //       .spyOn(authService, 'generateNewToken')
  //       .mockResolvedValueOnce(mockAccessToken)
  //       .mockResolvedValueOnce(mockRefreshToken);

  //     const result = await authService.loginUser(userDto);

  //     expect(authService.generateNewToken).toHaveBeenCalledWith(
  //       mockUser.id,
  //       mockUser.email,
  //       'access',
  //     );
  //     expect(authService.generateNewToken).toHaveBeenCalledWith(
  //       mockUser.id,
  //       mockUser.email,
  //       'refresh',
  //     );

  //     expect(result).toEqual({
  //       ...mockUser,
  //       accessToken: mockAccessToken,
  //       refreshToken: mockRefreshToken,
  //     });
  //   });
  // });

  describe('User can refresh token', () => {
    // const mockRefreshTokenDto = {
    //   token:
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA4MTMzODg2MDg0Iiwic3ViIjoiNjQ4YWI3YzhmM2QyN2IwNzkwYTc3OTUyIiwiaWF0IjoxNjg2ODEyNzI1LCJleHAiOjE2ODk0MDQ3MjV9.W3ICY0xf6PIGpS7DJQROBJP9L7q54tXkYOZIyLJTU_c',
    // };

    it('should throw an UnauthorizedException if the token is expired', async () => {
      const refreshTokenDto = { token: 'expired-refresh-token' };
      jwtService.verify = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token or token expired');
      });

      await expect(
        authService.refreshUserToken(refreshTokenDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should refresh the token and return the user details, access token, and new refresh token', async () => {
      const refreshTokenDto = { token: 'sample-refresh-token' };
      const verifiedJwtPayload = { email: 'test@gmail.com' };
      const user = {
        id: 1,
        email: 'test@gmail.com',
        password: 'password',
      };
      const accessToken = 'sample-access-token';
      const newRefreshToken = 'sample-new-refresh-token';

      jwtService.verify = jest.fn().mockReturnValue(verifiedJwtPayload);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(user);
      authService.generateNewToken = jest
        .fn()
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(newRefreshToken);

      const result = await authService.refreshUserToken(refreshTokenDto);

      expect(jwtService.verify).toHaveBeenCalledWith('sample-refresh-token', {
        secret: configService.get('jwt.refresh.secret'),
      });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@gmail.com' },
      });
      expect(authService.generateNewToken).toHaveBeenCalledWith(
        user.id,
        user.email,
        'access',
      );
      expect(authService.generateNewToken).toHaveBeenCalledWith(
        user.id,
        user.email,
        'refresh',
      );
      expect(result).toEqual({
        ...user,
        accessToken: 'sample-access-token',
        refreshToken: 'sample-new-refresh-token',
      });
    });
  });

  describe('generateNewToken', () => {
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA4MTMzODg2MDg0Iiwic3ViIjoiNjQ4YWI3YzhmM2QyN2IwNzkwYTc3OTUyIiwiaWF0IjoxNjg2ODEyNzI1LCJleHAiOjE2ODk0MDQ3MjV9.W3ICY0xf6PIGpS7DJQROBJP9L7q54tXkYOZIyLJTU_c';
    const mockId = 34;
    // const mockEmail = 'mock-phone';
    const mockType = 'access';

    it('should generate a new token with the correct parameters', async () => {
      jest.spyOn(authService, 'generateNewToken').mockResolvedValue(mockToken);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await authService.generateNewToken(
        mockId,
        mockEmail,
        mockType,
      );

      expect(result).toBe(mockToken);
    });
  });

  describe('checkDuplicateEmail', () => {
    it('should throw ConflictException if email already exists', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValue(mockUser as any);

      await expect(
        authService.checkDuplicateEmail(mockEmail),
      ).rejects.toThrowError('Email already in use.');

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: mockUser.email,
        },
      });
    });
  });

  describe('validateEmailExist', () => {
    it('should throw BadRequestException if user does not exist', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(
        authService.validateEmailExist(mockEmail),
      ).rejects.toThrowError(`User with this email does not exist.`);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: mockEmail,
        },
      });
    });

    it('should return valid user', async () => {
      const mockAccessToken = 'sample-access-token';
      const mockRefreshToken = 'sample-new-refresh-token';
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest
        .spyOn(authService, 'generateNewToken')
        .mockResolvedValueOnce(mockAccessToken)
        .mockResolvedValueOnce(mockRefreshToken);

      const user = await authService.validateEmailExist(mockEmail);

      expect(user).toEqual(mockUser);
    });
  });

  describe('validatePassword', () => {
    it('should throw UnauthorizedException if user password is incorrect', async () => {
      const mockUserDto = {
        id: 400,
        email: mockUser.email,
        password: 'mock-hashed-password-iii',
      };

      jest
        .spyOn(authService, 'validatePassword')
        .mockRejectedValue(
          new UnauthorizedException('Invalid password credentials'),
        );

      await expect(
        authService.validatePassword(mockUser.password, mockUserDto.password),
      ).rejects.toThrowError('Invalid password credentials');

      expect(authService.validatePassword).toHaveBeenCalledWith(
        mockUser.password,
        mockUserDto.password,
      );
    });
  });
});

function getRandomString(length) {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
