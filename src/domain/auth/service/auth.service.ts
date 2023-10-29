import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterInput } from '../dto/input/register.input';
import { LoginInput } from '../dto/input/login.input';
import { PrismaService } from '../../../prisma/service/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserType } from '../types/user.type';
import { RefreshTokenInput } from '../dto/input/refreshToken.input';
import { JwtPayload } from '../types/jwtPayload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async registerUser(registerInput: RegisterInput) {
    const { email, full_name, password } = registerInput;

    await this.checkDuplicateEmail(email);

    const hashedPassword = await argon.hash(password);

    const user = await this.prismaService.user.create({
      data: {
        email,
        full_name,
        password: hashedPassword,
      },
    });

    //delete user password for security
    delete user.password;

    return user;
  }
  async loginUser(loginInput: LoginInput) {
    const { email, password } = loginInput;

    const user = await this.validateEmailExist(email);

    await this.validatePassword(user.password, password);

    // Generate token  for user

    const [accessToken, refreshToken] = await Promise.all([
      this.generateNewToken(user.id, user.email, 'access'),
      this.generateNewToken(user.id, user.email, 'refresh'),
    ]);

    delete user.password;

    return { ...user, accessToken, refreshToken };
  }

  async refreshUserToken(refreshTokenInput: RefreshTokenInput) {
    const { token } = refreshTokenInput;
    try {
      const { email } = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get('jwt.refresh.secret'),
      });
      if (!email) throw new UnauthorizedException('Invalid token');

      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });

      //generate token
      const [accessToken, refreshToken] = await Promise.all([
        this.generateNewToken(user.id, user.email, 'access'),
        this.generateNewToken(user.id, user.email, 'refresh'),
      ]);

      delete user.password;
      return { ...user, accessToken, refreshToken };
    } catch (err) {
      throw new UnauthorizedException('Token expired');
    }
  }

  /**
   * Checks duplicate email
   */
  async checkDuplicateEmail(email: string): Promise<void> {
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) throw new ConflictException('Email already in use.');
  }

  /***
   *  generate New token
   */
  async generateNewToken(
    id: number,
    email: string,
    type: 'access' | 'refresh',
  ): Promise<string> {
    const token = await this.jwtService.signAsync(
      {
        email,
        sub: id,
      },
      {
        secret: this.configService.get(`jwt.${type}.secret`),
        expiresIn: this.configService.get(
          `jwt.${type}.signInOptions.expiresIn`,
        ),
      },
    );
    return token;
  }

  /***
   *  Validator to check if email exists
   */
  async validateEmailExist(email: string): Promise<UserType> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException(`User with this email does not exist.`);
    }

    return user;
  }

  /***
   *  Validator to check if password is correct
   */

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const correctPassword = argon.verify(hashedPassword, password);

    if (!correctPassword)
      throw new UnauthorizedException('Invalid password credentials');
  }
}
