import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, CreateReviewDto } from '../dto';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, role: true, createdAt: true,
        reviews: {
          include: { book: { select: { id: true, title: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');
    return this.prisma.user.create({
      data: { email: dto.email, password: dto.password, role: Role.PATRON },
      select: { id: true, email: true, role: true, createdAt: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }

  // --- Reviews ---

  async addReview(dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: dto,
      include: {
        book: { select: { id: true, title: true } },
        user: { select: { id: true, email: true } },
      },
    });
  }

  findReviewsForBook(bookId: number) {
    return this.prisma.review.findMany({
      where: { bookId },
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}

