import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

export class QueryImportDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'tìm kiếm theo tên nhãn hàng, id nhập kho',
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
    description: 'tìm kiếm theo id sản phẩm',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  product_id?: string;

  @ApiProperty({
    description: 'tìm kiếm theo id biến thể sản phẩm',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  skus_id?: string;

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
}
