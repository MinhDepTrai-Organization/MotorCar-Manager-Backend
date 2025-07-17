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
  IsEmail,
} from 'class-validator';
import { ProductType } from 'src/constants';
import { CreateSkusDto } from 'src/modules/skus/dto/create-skus.dto';

export class InfoContact {
  @IsString()
  @ApiProperty({
    description: 'Tên',
    example: 'Ngô Đình Phuoc',
  })
  @IsNotEmpty()
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Số điện thoại',
    example: '0865446276',
  })
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email',
    example: 'phuoc@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Ghi chú',
    example: 'Tôi cần báo giá nhanh về mẫu xe mới.',
  })
  note: string;
}
