import { IsString, IsNotEmpty, MinLength, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGenreDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;
}

export class UpdateGenreDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string;
}

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  author!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  isbn!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  totalCopies?: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  genreId!: number;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  author?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  totalCopies?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  genreId?: number;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  bookId!: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  userId!: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

