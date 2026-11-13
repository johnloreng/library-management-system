import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, ParseIntPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from '../dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  /** GET /books?genreId=2 */
  @Get()
  findAll(@Query('genreId') genreId?: string) {
    return this.bookService.findAll(genreId ? +genreId : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }

  /** POST /books/:id/borrow */
  @Post(':id/borrow')
  borrow(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.borrow(id);
  }

  /** POST /books/:id/return */
  @Post(':id/return')
  returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.returnBook(id);
  }
}

