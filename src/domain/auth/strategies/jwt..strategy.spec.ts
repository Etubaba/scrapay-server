import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('your-secret-key'),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('validate', () => {
    it('should return an object with id and phone properties', async () => {
      const payload = { sub: 'user-id', email: 'element@gmail.com' };
      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({ id: 'user-id', email: 'element@gmail.com' });
    });
  });

  describe('strategy options', () => {
    it('should have secretOrKey set to the value returned from ConfigService', () => {
      const secretOrKey = configService.get('jwt.access.secret');

      expect(secretOrKey).toBe('your-secret-key');
    });
  });
});
