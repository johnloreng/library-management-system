import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto, UpdateGenreDto } from '../dto';

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.genre.findMany({
      include: { _count: { select: { books: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { books: true },
    });
    if (!genre) throw new NotFoundException(`Genre #${id} not found`);
    return genre;
  }

  create(dto: CreateGenreDto) {
    return this.prisma.genre.create({ data: dto });
  }

  async update(id: number, dto: UpdateGenreDto) {
    await this.findOne(id);
    return this.prisma.genre.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.genre.delete({ where: { id } });
  }
}

