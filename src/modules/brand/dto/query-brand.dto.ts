import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

class QueryBrandDto extends PaginationQueryDto {
  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Từ khóa tìm kiếm theo tên thương hiệu',
    required: false,
  })
  search?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_from',
    required: false,
    description: 'Filter brand created from a specific date',
    example: '',
  })
  created_from?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_to',
    required: false,
    format: 'iso8601',
    description: 'Filter brand created to a specific date',
    example: '',
  })
  created_to?: string;
}

export default QueryBrandDto;
