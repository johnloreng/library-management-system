import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateReviewDto } from '../dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users/profile - Stretch: Reads the authenticated user from the request via @Req()
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: { user: unknown }) {
    return req.user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post('reviews')
  addReview(@Body() dto: CreateReviewDto) {
    return this.usersService.addReview(dto);
  }

  @Get('reviews/book/:bookId')
  reviewsForBook(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.usersService.findReviewsForBook(bookId);
  }
}

