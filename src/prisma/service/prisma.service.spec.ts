import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  jest.setTimeout(20000);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should connect to the database', async () => {
    jest.setTimeout(10000);
    console.log('start');
    await expect(prismaService.$connect()).resolves.toBeUndefined();
    console.log('done');
  });
});
