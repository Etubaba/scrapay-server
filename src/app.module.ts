import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { BookModule } from './domain/book/book.module';
import { AuthorizationModule } from './domain/authorization/authorization.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),

    PrismaModule,
    BookModule,
    AuthorizationModule,
  ],

  providers: [AppResolver],
})
export class AppModule {}
