import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ProductType } from 'src/constants';

export class FindProductDto {
  @IsUUID() // Chỉ cho phép UUID v4
  id: string;
}

export enum EnumProductSortBy {
  CREATED_AT_DESC = 'createdAtDesc',
  UPDATED_AT_DESC = 'updatedAtDesc',
  PRICE_ASC = 'priceAsc',
  PRICE_DESC = 'priceDesc',
  BEST_SELLING = 'bestSelling',
}

export const EnumProductSortByLabel = {
  [EnumProductSortBy.CREATED_AT_DESC]: 'Mới nhất',
  [EnumProductSortBy.UPDATED_AT_DESC]: 'Cập nhật gần đây',
  [EnumProductSortBy.PRICE_ASC]: 'Giá thấp đến cao',
  [EnumProductSortBy.PRICE_DESC]: 'Giá cao đến thấp',
  [EnumProductSortBy.BEST_SELLING]: 'Bán chạy nhất',
};

export class ProductQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  current?: number;
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pageSize?: number;
  @IsOptional()
  @IsUUID()
  brandID?: string;
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price_min?: number;
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price_max?: number;
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsUUID()
  categoryID?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    throw new BadRequestException('Status must be true or false');
  })
  status?: boolean;

  @IsOptional()
  @IsEnum(EnumProductSortBy)
  @ApiProperty({
    enum: EnumProductSortBy,
    description: 'Sort products by various criteria',
    example: EnumProductSortBy.UPDATED_AT_DESC,
    required: false,
  })
  sort_by?: EnumProductSortBy;
}
