import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { ProductType } from 'src/constants';
import { CreateSkusDto } from 'src/modules/skus/dto/create-skus.dto';

export class CreateProductSpecificationDto {
  @IsString()
  @ApiProperty({
    description: 'Tên thuộc tính',
    example: 'Màu sắc',
  })
  @IsNotEmpty()
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Giá trị thuộc tính',
    example: 'Đỏ',
  })
  @IsNotEmpty()
  value: string;
}

export class CreateProductVariantDto {
  @IsEnum(ProductType)
  @ApiProperty({
    description: 'Loại sản phẩm',
    enum: ProductType,
    example: ProductType.CAR,
  })
  @IsNotEmpty()
  type: ProductType;

  @ApiProperty({
    description: 'Slug sản phẩm',
    example: 'Xe-ô-tô-vinfast ko có biến thể ',
  })
  @IsString()
  @IsNotEmpty()
  slug_product: string;

  @ApiProperty({
    description: 'Tiêu đề sản phẩm',
    example: 'Xe ô tô Vinfast ko có biến thể',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Mô tả sản phẩm',
    example: '<p><strong>Xe máy điện VinFast...</strong></p>',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID thương hiệu',
    example: '44d018c0-603f-47b0-9ea4-256fed4d9cc7',
  })
  @IsString()
  @IsNotEmpty()
  brand_id: string;

  @ApiProperty({
    description: 'ID danh mục',
    example: '821888a8-544c-4793-8cf3-0d1a877e15b5',
  })
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty({
    type: CreateProductSpecificationDto,
    isArray: true,
    description: 'Danh sách thông số kỹ thuật',
    required: false,
    example: [
      {
        name: 'Màu sắc',
        value: 'Đỏ',
      },
    ],
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateProductSpecificationDto)
  @IsOptional()
  specifications?: CreateProductSpecificationDto[];

  @ApiProperty({
    description: 'Danh sách hình ảnh sản phẩm',
    example: ['a.png', 'b.png', 'c.png'],
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    type: CreateSkusDto,
    description: 'Thông tin SKU',
    isArray: true,
    required: true,
  })
  @ValidateNested()
  @Type(() => CreateSkusDto)
  skus: CreateSkusDto[];
}
