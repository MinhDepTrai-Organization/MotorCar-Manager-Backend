import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// DTO để cập nhật chi tiết nhập kho
export class UpdateDetailImportDto {
  @ApiPropertyOptional({
    description: 'id của skus',
    example: '',
  })
  @IsUUID()
  skus_id: string;
  @ApiPropertyOptional({
    description: 'id chi tiết nhập kho',
    example: '',
  })
  @IsUUID(undefined, { message: 'detail_import_id must be a valid UUID' })
  @IsOptional()
  detail_import_id?: string;
  @ApiPropertyOptional({ description: 'Giá nhập sản phẩm', example: 100000 })
  @IsOptional()
  @IsNumber()
  price_import?: number;

  @ApiPropertyOptional({ description: 'Số lượng nhập', example: 50 })
  @IsOptional()
  @IsNumber()
  quantity_import?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'id kho ',
    example: '',
  })
  @IsUUID()
  warehouse_id?: string;

  @ApiProperty({
    example: '',
    description:
      'Tên lô hàng, có thể là tên của sản phẩm hoặc tên khác mà bạn muốn đặt cho lô hàng này.',
  })
  @IsString()
  @IsOptional()
  lot_name?: string;
}
