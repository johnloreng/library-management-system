import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GenreModule } from './genre/genre.module';
import { BookModule } from './book/book.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, GenreModule, BookModule, UserModule],
})
export class AppModule {}

