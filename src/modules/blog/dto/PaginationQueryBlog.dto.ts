import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

enum sortBy {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class BlogPaginationQueryDto extends PaginationQueryDto {
  @ApiProperty({
    name: 'search',
    required: false,
    description: 'Search input for records by title, content or slug',
    default: '',
  })
  @IsOptional()
  @IsString()
  search?: string = '';

  @ApiProperty({
    name: 'category_id',
    required: false,
    description: 'Filter by category id',
    default: '',
  })
  @IsOptional()
  @IsUUID()
  blog_category_id?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_from',
    required: false,
    description: 'Filter user created from a specific date',
    example: '2021-01-01',
  })
  created_from?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_to',
    required: false,
    format: 'iso8601',
    description: 'Filter user created to a specific date',
    example: '2021-01-01',
  })
  created_to?: string;
}
