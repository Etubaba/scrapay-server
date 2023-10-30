import { Test, TestingModule } from '@nestjs/testing';
import { BookResolver } from './book.resolver';
import { BookService } from '../service/book.service';
import { Book } from '../entities/book.entity';
import { CreateBookInput } from '../dto/create-book.input';
import { UpdateBookInput } from '../dto/update-book.input';

describe('BookResolver', () => {
  let bookResolver: BookResolver;
  let bookService: BookService;

  const createBookInput: CreateBookInput = {
    name: 'Sample Book',
    description: 'This is a test book',
  };

  const mockBook: Book = {
    id: 1,
    name: 'Sample Book',
    description: 'This is a test book',
  };

  const mockBooks: Book[] = [mockBook];

  const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookResolver,
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    bookResolver = module.get<BookResolver>(BookResolver);
    bookService = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(bookResolver).toBeDefined();
  });

  describe('createBook', () => {
    it('should create a new book', async () => {
      mockBookService.create.mockResolvedValue(mockBook);

      const result = await bookResolver.createBook(createBookInput);

      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return a list of books', async () => {
      mockBookService.findAll.mockResolvedValue(mockBooks);

      const result = await bookResolver.findAll();

      expect(result).toEqual(mockBooks);
    });
  });

  describe('findOne', () => {
    it('should return a single book by ID', async () => {
      mockBookService.findOne.mockResolvedValue(mockBook);

      const result = await bookResolver.findOne(1);

      expect(result).toEqual(mockBook);
    });
  });

  describe('updateBook', () => {
    it('should update a book', async () => {
      const updateBookInput: UpdateBookInput = {
        id: 1,
        name: 'Updated Book',
        description: 'This is an updated book',
      };
      mockBookService.update.mockResolvedValue(mockBook);

      const result = await bookResolver.updateBook(updateBookInput);

      expect(result).toEqual(mockBook);
    });
  });

  describe('removeBook', () => {
    it('should delete a book by ID', async () => {
      mockBookService.remove.mockResolvedValue(mockBook);

      const result = await bookResolver.removeBook(1);

      expect(result).toEqual(mockBook);
    });
  });
});
