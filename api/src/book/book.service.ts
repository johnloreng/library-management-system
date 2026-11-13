import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, UpdateBookDto } from '../dto';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(genreId?: number) {
    return this.prisma.book.findMany({
      where: genreId ? { genreId } : undefined,
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

