import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

class QueryExportDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'tìm kiếm theo tên nhãn hàng, id xuất kho',
    required: false,
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'tìm kiếm theo id kho',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  warehouse_id?: string;

  @ApiProperty({
    description: 'Tìm kiếm theo khoảng thời gian tạo',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    description: 'Tìm kiếm theo khoảng thời gian tạo',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({
    description: 'Tìm kiếm theo id sản phẩm',
    required: false,
  })
  @IsOptional()
  product_id?: string;

  @ApiProperty({
    description: 'Tìm kiếm theo id biến thể sản phẩm',
    required: false,
  })
  @IsOptional()
  skus_id?: string;
}

export default QueryExportDto;
