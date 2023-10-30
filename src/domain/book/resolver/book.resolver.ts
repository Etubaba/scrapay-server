import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BookService } from '../service/book.service';
import { Book } from '../entities/book.entity';
import { CreateBookInput } from '../dto/create-book.input';
import { UpdateBookInput } from '../dto/update-book.input';
import { JwtGuard } from '../../../domain/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Mutation(() => Book)
  @UseGuards(JwtGuard)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.bookService.create(createBookInput);
  }

  @Query(() => [Book], { name: 'books' })
  @UseGuards(JwtGuard)
  findAll() {
    return this.bookService.findAll();
  }

  @Query(() => Book, { name: 'book' })
  @UseGuards(JwtGuard)
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Book)
  @UseGuards(JwtGuard)
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.bookService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => Book)
  @UseGuards(JwtGuard)
  removeBook(@Args('id', { type: () => Int }) id: number) {
    return this.bookService.remove(id);
  }
}
