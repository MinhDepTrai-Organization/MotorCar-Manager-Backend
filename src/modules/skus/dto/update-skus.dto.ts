import { PartialType } from '@nestjs/mapped-types';
import { CreateSkusDto, VariantCombinationDto } from './create-skus.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSkusDto {
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
}
