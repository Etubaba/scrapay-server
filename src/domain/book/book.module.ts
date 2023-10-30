import { Module } from '@nestjs/common';
import { BookService } from './service/book.service';
import { BookResolver } from './resolver/book.resolver';

@Module({
  providers: [BookResolver, BookService],
})
export class BookModule {}
