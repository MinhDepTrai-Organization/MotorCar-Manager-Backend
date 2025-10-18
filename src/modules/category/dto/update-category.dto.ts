import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Enum } from '@solana/web3.js';
import { ProductType } from 'src/constants';

class Category {
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsNotEmpty()
  name: string;
}
export class UpdateCategoryDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'name of category - optional',
    example: 'Xe con con',
  })
  name: string;

  @ApiProperty({
    example: 'slug',
    description: 'slug',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @ApiProperty({ description: 'description', example: 'description' })
  description: string;
  @IsOptional()
  @ApiProperty({
    description: 'ID của category cha nếu có  of category - optional',
    example: 16, // thêm ví dụ minh họa
  })
  parentCategoryId: number; // ID của category cha nếu có
  @IsOptional()
  @IsArray()
  children?: Category[];

  @ApiProperty({
    type: Enum,
    example: ProductType.CAR,
    enum: ProductType,
    description: 'Loại sản phẩm thuộc danh mục này',
  })
  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;
}
