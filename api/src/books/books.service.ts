import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Builds a Prisma where clause from genreId/search and applies skip/take for pagination.
   */
  async findAll(query?: QueryBooksDto) {
    const where: Prisma.BookWhereInput = {};

    if (query?.genreId) {
      where.genreId = query.genreId;
    }

    if (query?.search && query.search.trim().length > 0) {
      const term = query.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { author: { contains: term, mode: 'insensitive' } },
        { isbn: { contains: term, mode: 'insensitive' } },
      ];
    }

    const page = query?.page && query.page > 0 ? query.page : 1;
    const limit = query?.limit && query.limit > 0 ? query.limit : undefined;
    const skip = limit ? (page - 1) * limit : undefined;
    const take = limit;

    return this.prisma.book.findMany({
      where,
      skip,
      take,
      include: {
        genre: true,
        _count: { select: { reviews: true } },
      },
      orderBy: { title: 'asc' },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
        reviews: {
          include: { user: { select: { id: true, email: true, role: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!book) throw new NotFoundException(`Book #${id} not found`);
    return book;
  }

  create(dto: CreateBookDto) {
    const { totalCopies = 1, ...rest } = dto;
    return this.prisma.book.create({
      data: { ...rest, totalCopies, availableCopies: totalCopies },
      include: { genre: true },
    });
  }

  async update(id: number, dto: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({
      where: { id },
      data: dto,
      include: { genre: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }

  /** Decrement availableCopies by 1 (borrow) */
  async borrow(id: number) {
    const book = await this.findOne(id);
    if (book.availableCopies < 1) {
      throw new BadRequestException('No copies available');
    }
    return this.prisma.book.update({
      where: { id },
      data: { availableCopies: { decrement: 1 } },
      include: { genre: true },
    });
  }

  /** Increment availableCopies by 1 (return) */
  async returnBook(id: number) {
    const book = await this.findOne(id);
    if (book.availableCopies >= book.totalCopies) {
      throw new BadRequestException('All copies are already returned');
    }
    return this.prisma.book.update({
      where: { id },
      data: { availableCopies: { increment: 1 } },
      include: { genre: true },
    });
  }
}
