import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BookService } from '../service/book.service';
import { Book } from '../entities/book.entity';
import { CreateBookInput } from '../dto/create-book.input';
import { UpdateBookInput } from '../dto/update-book.input';
import { AuthorizationGuard } from '../../authorization/guard/authorization.guard';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Resolver(() => Book)
export class BookResolver {
  constructor(private readonly bookService: BookService) {}
  @UseGuards(AuthorizationGuard)
  @Mutation(() => Book)
  createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.bookService.create(createBookInput);
  }

  @UseGuards(AuthorizationGuard)
  @Query(() => [Book], { name: 'books' })
  findAll() {
    return this.bookService.findAll();
  }
  @UseGuards(AuthorizationGuard)
  @Query(() => Book, { name: 'book' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.bookService.findOne(id);
  }

  @UseGuards(AuthorizationGuard)
  @Mutation(() => Book)
  updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.bookService.update(updateBookInput.id, updateBookInput);
  }

  @UseGuards(AuthorizationGuard)
  @Mutation(() => Book)
  removeBook(@Args('id', { type: () => Int }) id: number) {
    return this.bookService.remove(id);
  }
}
