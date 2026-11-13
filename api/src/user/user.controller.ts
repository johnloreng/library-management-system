import {
  Controller, Get, Post, Delete,
  Param, Body, ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, CreateReviewDto } from '../dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  /** POST /users/reviews */
  @Post('reviews')
  addReview(@Body() dto: CreateReviewDto) {
    return this.userService.addReview(dto);
  }

  /** GET /users/reviews/book/:bookId */
  @Get('reviews/book/:bookId')
  reviewsForBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.userService.findReviewsForBook(bookId);
  }
}

