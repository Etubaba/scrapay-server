import { Injectable } from '@nestjs/common';
import { CreateBookInput } from '../dto/create-book.input';
import { UpdateBookInput } from '../dto/update-book.input';
import { PrismaService } from '../../../prisma/service/prisma.service';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}
  async create(createBookInput: CreateBookInput) {
    const book = await this.prismaService.book.create({
      data: {
        ...createBookInput,
      },
    });
    return book;
  }

  async findAll() {
    const books = await this.prismaService.book.findMany({});
    return books;
  }

  async findOne(id: number) {
    const game = await this.prismaService.book.findUnique({
      where: {
        id,
      },
    });
    return game;
  }

  async update(id: number, updateBookInput: UpdateBookInput) {
    const { description, name } = updateBookInput;
    const updatedGame = await this.prismaService.book.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });
    return updatedGame;
  }

  async remove(id: number) {
    const deletedBook = await this.prismaService.book.delete({
      where: {
        id,
      },
    });
    return deletedBook;
  }
}
