import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Enum } from '@solana/web3.js';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleEnum } from 'src/constants/role.enum';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

class QueryUserDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by user ID, username, or email',
  })
  search?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_from',
    required: false,
    description: 'Filter user created from a specific date',
    example: '2021-01-01',
  })
  created_from?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_to',
    required: false,
    format: 'iso8601',
    description: 'Filter user created to a specific date',
    example: '2021-01-01',
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
  @IsEnum(RoleEnum)
  @ApiProperty({
    name: 'role',
    required: false,
    type: Enum,
    example: RoleEnum.ADMIN,
    description: 'Filter by user role',
  })
  role?: RoleEnum;
}

export default QueryUserDto;
