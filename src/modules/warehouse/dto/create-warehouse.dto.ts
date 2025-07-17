import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    example: 'Kho Hà Nội',
    description: 'Tên kho',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Tên kho không được để trống' })
  name: string;

  @ApiProperty({
    example: 'Số 123, Đống Đa, Hà Nội',
    description: 'Địa chỉ kho',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: 'Kho chứa hàng điện tử',
    description: 'Mô tả kho',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
  
}
