import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Enum } from '@solana/web3.js';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ProductType } from 'src/constants';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

export enum CategoryResponseType {
  TREE = 'tree',
  FLAT = 'flat',
}

class QueryCategoryDto extends PaginationQueryDto {
  @IsOptional()
  @ApiProperty({
    description: 'Search categories by id, name or slug',
    example: '',
    required: false,
  })
  search?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Filter categories by type',
    required: false,
    enum: ProductType,
    type: ProductType,
  })
  type?: ProductType;
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    throw new BadRequestException('Status must be true or false');
  })
  @ApiProperty({
    description: 'Filter categories by status',
    required: false,
    type: Boolean,
  })
  status?: boolean;

  @IsOptional()
  @IsEnum(CategoryResponseType)
  @ApiProperty({
    description:
      'Response type: tree (only root categories) or flat (all categories flattened)',
    enum: CategoryResponseType,
    required: false,
    default: CategoryResponseType.TREE,
  })
  responseType?: CategoryResponseType;
}

export default QueryCategoryDto;
