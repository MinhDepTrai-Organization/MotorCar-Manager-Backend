import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

class QueryBlogCategoryDto extends PaginationQueryDto {
  @IsOptional()
  @ApiProperty({
    name: 'search',
    example: 'AI Technologies',
    description: 'Search by id, name, description or slug of the blog category',
    required: false,
  })
  search?: string;
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    throw new BadRequestException('Status must be true or false');
  })
  status?: boolean;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_from',
    required: false,
    description: 'Filter blog category created from a specific date',
    example: '2021-01-01',
  })
  created_from?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_to',
    required: false,
    format: 'iso8601',
    description: 'Filter blog category created to a specific date',
    example: '2021-01-01',
  })
  created_to?: string;

  @IsOptional()
  @ApiProperty({
    name: 'blogId',
    required: false,
    description: 'Filter blog category by blog id',
    example: '1',
  })
  @IsUUID()
  blogId?: string;
}
export default QueryBlogCategoryDto;
