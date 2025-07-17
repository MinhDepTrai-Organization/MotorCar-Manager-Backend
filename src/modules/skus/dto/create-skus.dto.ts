import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';

export class SkusDetailImportDto {
  @ApiProperty({
    description: 'ID kho hàng',
    example: '74f68f7c-a9a9-41ed-a5ec-132a93051abb',
  })
  @IsString()
  warehouse_id: string;

  @ApiProperty({ description: 'Số lượng nhập', example: 1000 })
  @IsNumber()
  quantity_import: number;

  @ApiProperty({ description: 'Giá nhập', example: 2300 })
  @IsNumber()
  price_import: number;

  @ApiProperty({
    description: 'Tên lô hàng',
    example: 'Lô hàng 1',
  })
  @IsOptional()
  @IsString()
  lot_name?: string;
}

export class VariantCombinationDto {
  @ApiProperty({ example: '1ac80854-7166-41a5-bcd8-3473be9264b8' })
  @IsString()
  option_id: string;

  @ApiProperty({ example: 'Xanh lá' })
  @IsString()
  value: string;
}

export class CreateSkusDto {
  @ApiProperty({
    description: 'ID của sản phẩm',
    required: false,
    example: '123',
  })
  @IsUUID()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ description: 'Mã SKU', example: '123', required: false })
  @IsString()
  @IsOptional()
  masku?: string;

  @ApiProperty({ description: 'Mã vạch', example: '123', required: false })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({
    description: 'Hình ảnh biến thể sản phẩm',
    example: 'a.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Giá bán', example: 2500, required: true })
  @IsNumber()
  @IsNotEmpty()
  price_sold: number;

  @ApiProperty({ description: 'Giá so sánh', example: 2500, required: true })
  @IsNumber()
  @IsOptional()
  price_compare: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantCombinationDto)
  @ApiProperty({
    type: [VariantCombinationDto],
    description: 'Danh sách biến thể sản phẩm',
    required: false,
    isArray: true,
    example: [
      {
        option_id: '1ac80854-7166-41a5-bcd8-3473be9264b8',
        value: 'Xanh lá',
      },
    ],
  })
  variant_combinations?: VariantCombinationDto[];

  @ApiProperty({
    type: SkusDetailImportDto,
    description: 'Chi tiết nhập kho',
    required: true,
    isArray: true,
    example: [
      {
        warehouse_id: '74f68f7c-a9a9-41ed-a5ec-132a93051abb',
        quantity_import: 1000,
        price_import: 2300,
        lot_name: 'Lô hàng 1',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkusDetailImportDto)
  detail_import: SkusDetailImportDto[];
}
