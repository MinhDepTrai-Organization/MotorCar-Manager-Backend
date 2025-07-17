import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

class QuerySkusDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'ID nhãn hàng',
    required: false,
  })
  brand_id?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'ID sản phẩm',
    required: false,
  })
  product_id?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'ID kho hàng',
    required: false,
  })
  warehouse_id?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Tìm kiếm theo tên nhãn hàng, id nhập kho',
    required: false,
  })
  search?: string;
}

export default QuerySkusDto;
