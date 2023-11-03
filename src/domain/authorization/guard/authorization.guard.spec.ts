import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthorizationGuard } from './authorization.guard';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// Mock the dependencies used in AuthorizationGuard
const mockConfigService = {
  get: jest.fn(),
};

const mockJwt = jest.fn();

describe('AuthorizationGuard', () => {
  let guard: AuthorizationGuard;

  beforeEach(async () => {
    // Create a testing module with the AuthorizationGuard and mocked dependencies
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationGuard,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    guard = module.get<AuthorizationGuard>(AuthorizationGuard);

    guard['jwt'] = mockJwt;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
