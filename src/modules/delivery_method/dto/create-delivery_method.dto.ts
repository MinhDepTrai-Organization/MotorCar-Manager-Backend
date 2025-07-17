import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDeliveryMethodDto {
  @MaxLength(100, { message: 'Delivery Method name is max 100 characters' })
  @MinLength(10, { message: 'Delivery Method name is min 10 characters' })
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    example: 'Giao hàng tiết kiệm',
    name: 'name',
    description: 'Tên phương thức giao hàng',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'Giao hàng tiết kiệm là dịch vụ giao hàng nhanh chóng',
    description: 'Mô tả phương thức giao hàng',
    name: 'description',
  })
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(100000, { message: 'Delivery fee is min 100000' })
  @ApiProperty({
    type: 'number',
    example: 100000,
    name: 'fee',
    description: 'Phí giao hàng',
  })
  fee: number;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    required: false,
    type: 'string',
    example: 'https://giao-hang-tiet-kiem.vn/logo.png',
    description: 'Logo phương thức giao hàng',
    name: 'logo',
  })
  logo?: string;
}
