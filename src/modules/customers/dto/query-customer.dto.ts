import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { GenderEnum } from 'src/constants';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

export enum SpendingEnumRange {
  BELOW_1M = 'BELOW_1M',
  FROM_1M_TO_5M = 'FROM_1M_TO_5M',
  FROM_5M_TO_20M = 'FROM_5M_TO_20M',
  FROM_20M_TO_50M = 'FROM_20M_TO_50M',
  ABOVE_50M = 'ABOVE_50M',
}

export const SpendingEnumRangeValueMap = {
  [SpendingEnumRange.BELOW_1M]: { min: 0, max: 1_000_000 },
  [SpendingEnumRange.FROM_1M_TO_5M]: { min: 1_000_000, max: 5_000_000 },
  [SpendingEnumRange.FROM_5M_TO_20M]: { min: 5_000_000, max: 20_000_000 },
  [SpendingEnumRange.FROM_20M_TO_50M]: { min: 20_000_000, max: 50_000_000 },
  [SpendingEnumRange.ABOVE_50M]: { min: 50_000_001, max: null },
};

class QueryCustomerDto extends PaginationQueryDto {
  @IsOptional()
  @ApiProperty({
    description: '',
    type: String,
    required: false,
    example: '',
  })
  search?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_from',
    required: false,
    description: 'Filter user created from a specific date',
    example: '',
  })
  created_from?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_to',
    required: false,
    format: 'iso8601',
    description: 'Filter user created to a specific date',
    example: '',
  })
  created_to?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    throw new BadRequestException('Status must be true or false');
  })
  status?: boolean;

  @IsOptional()
  @IsEnum(GenderEnum)
  @ApiProperty({
    name: 'gender',
    required: false,
    type: GenderEnum,
    example: GenderEnum.MALE,
    enum: GenderEnum,
  })
  gender?: GenderEnum;

  @IsOptional()
  @IsEnum(SpendingEnumRange)
  @ApiProperty({
    name: 'revenue_range',
    required: false,
    enum: SpendingEnumRange,
    type: SpendingEnumRange,
    example: SpendingEnumRange.BELOW_1M,
  })
  spending_range?: SpendingEnumRange;
}

export default QueryCustomerDto;
