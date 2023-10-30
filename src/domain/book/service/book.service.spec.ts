import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { PrismaService } from '../../../prisma/service/prisma.service';

describe('BookService', () => {
  let bookService: BookService;
  let prisma: PrismaService;

  const mockPrismaService = {
    book: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const createBookInput = {
    name: 'Sample Book',
    description: 'This is a test book',
  };

  const mockBook = {
    id: 1,
    name: 'Sample Book',
    description: 'This is a test book',
  };

  const mockBooks = [mockBook];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      mockPrismaService.book.create.mockResolvedValue(mockBook);

      const result = await bookService.create(createBookInput);

      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return a list of books', async () => {
      mockPrismaService.book.findMany.mockResolvedValue(mockBooks);

      const result = await bookService.findAll();

      expect(result).toEqual(mockBooks);
    });
  });

  describe('findOne', () => {
    it('should return a single book by ID', async () => {
      mockPrismaService.book.findUnique.mockResolvedValue(mockBook);

      const result = await bookService.findOne(1);

      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      mockPrismaService.book.update.mockResolvedValue(mockBook);

      const result = await bookService.update(1, {
        id: 1,
        name: 'Updated Book',
        description: 'This is an updated book',
      });

      expect(result).toEqual(mockBook);
    });
  });

  describe('remove', () => {
    it('should delete a book by ID', async () => {
      mockPrismaService.book.delete.mockResolvedValue(mockBook);

      const result = await bookService.remove(1);

      expect(result).toEqual(mockBook);
    });
  });
});
