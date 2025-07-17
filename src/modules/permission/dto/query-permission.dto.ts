import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

export default class QueryPermissionDto extends PaginationQueryDto {
  @IsOptional()
  @ApiProperty({
    name: 'search',
    description: 'Tìm kiếm theo tên hoặc đường dẫn',
    required: false,
    type: String,
  })
  @IsString()
  search?: string;

  @IsOptional()
  @ApiProperty({
    name: 'method',
    description: 'Phương thức HTTP (GET, POST, PUT, DELETE)',
    required: false,
    type: String,
  })
  @IsString()
  method?: string;

  @IsOptional()
  @ApiProperty({
    name: 'module',
    description: 'Tên module của permission',
    required: false,
    type: String,
  })
  @IsString()
  module?: string;
}
