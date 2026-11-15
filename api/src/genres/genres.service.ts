import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
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
    if (!genre) {
      throw new NotFoundException(`Genre #${id} not found`);
    }
    return genre;
  }

  async create(dto: CreateGenreDto) {
    const existing = await this.prisma.genre.findFirst({
      where: {
        OR: [{ name: dto.name }, { slug: dto.slug }],
      },
    });
    if (existing) {
      throw new ConflictException(`Genre with name "${dto.name}" or slug "${dto.slug}" already exists`);
    }
    return this.prisma.genre.create({ data: dto });
  }

  async update(id: number, dto: UpdateGenreDto) {
    await this.findOne(id);

    if (dto.name || dto.slug) {
      const existing = await this.prisma.genre.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(dto.name ? [{ name: dto.name }] : []),
                ...(dto.slug ? [{ slug: dto.slug }] : []),
              ],
            },
          ],
        },
      });
      if (existing) {
        throw new ConflictException('Another genre with this name or slug already exists');
      }
    }

    return this.prisma.genre.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);

    const associatedBooksCount = await this.prisma.book.count({
      where: { genreId: id },
    });
    if (associatedBooksCount > 0) {
      throw new BadRequestException('Cannot delete genre with existing books associated with it');
    }

    return this.prisma.genre.delete({ where: { id } });
  }
}
