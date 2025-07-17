import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { SortOrder } from 'src/constants/sortOrder.enum';

export class PaginationQueryDto {
  @ApiProperty({
    name: 'current',
    required: false,
    default: 1,
    description: 'Current page',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  current?: number = 1;

  @ApiProperty({
    name: 'pageSize',
    required: false,
    default: 10,
    description: 'Number of record each page',
  })
  @IsOptional()
  @IsInt()
  @Min(5, {
    message: 'Minimum pagesize value is 5',
  })
  @Type(() => Number)
  pageSize?: number = 10;

  @ApiProperty({
    name: 'sortOrder',
    required: false,
    default: SortOrder.DESC,
    description: 'Sort order: asc (ascending) or desc (descending)',
    enum: SortOrder,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: string = SortOrder.DESC;
}
