import { PartialType } from '@nestjs/mapped-types';
import { CreateVourcherDto } from './create-vourcher.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateVourcherDto {
  @ApiProperty({
    description: 'Mã voucher',
    example: 'VOUCHER123',
    required: true,
  })
  @IsOptional()
  @IsString()
  voucher_code: string;

  @ApiProperty({
    description: 'Tên voucher',
    example: 'Discount 10%',
    required: true,
  })
  @IsOptional()
  @IsString()
  voucher_name: string;

  @ApiProperty({
    description: 'Mô tả voucher',
    example: 'Giảm giá 10% cho mua sắm',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Số lần đã sử dụng',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  uses: number = 0;

  @ApiProperty({
    description: 'Số lần sử dụng tối đa',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  max_uses?: number;

  @ApiProperty({
    description: 'Số lần sử dụng tối đa cho mỗi người dùng',
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  max_uses_user?: number;

  @ApiProperty({
    description: 'Số lượng',
    example: 500,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Số tiền giảm giá',
    example: 50000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  discount_amount?: number;

  @ApiProperty({
    description: 'Mảng ID của type voucher',
    example: 'e2e20adb-9980-4d78-9541-8ba9a5ca6b0e',
    required: false,
    type: String, // chú ý chỗ này để Swagger hiểu đây là mảng chuỗi
  })
  @IsString()
  @IsOptional()
  type_voucher_id;

  @ApiProperty({
    description: 'Có phải giá trị cố định không',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  fixed: boolean = false;

  @ApiProperty({
    description: 'Trạng thái voucher',
    example: 'active',
    enum: ['active', 'inactive', 'expired'],
    required: false,
    default: 'active',
  })
  @IsEnum(['active', 'inactive', 'expired'])
  @IsOptional()
  status: 'active' | 'inactive' | 'expired' = 'active';

  @ApiProperty({
    description: 'Ngày bắt đầu',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date) // Chuyển chuỗi thành Date object
  @Transform(({ value }) => new Date(value)) // Chuyển chuỗi thành Date
  @IsOptional()
  start_date?: Date;

  @ApiProperty({
    description: 'Ngày hết hạn',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsDate()
  @Type(() => Date) // Chuyển chuỗi thành Date object
  @Transform(({ value }) => new Date(value)) // Chuyển chuỗi thành Date
  @IsOptional()
  end_date?: Date;

  //   @ApiProperty({
  //     description: 'ID của loại voucher',
  //     example: 'cbc5679d-9a66-48a4-8ca4-e8d578837ad0',
  //     required: true,
  //   })
  //   @IsString()
  //   @IsNotEmpty()
  //   type_voucher_id: string;

  //   @ApiProperty({
  //     description: 'Danh sách ID của các khách hàng nhận voucher',
  //     example: [
  //       '1c8c53b1-be42-43a9-b37f-2f2e3ede61b2',
  //       // 'f5f10860-0043-4a59-b988-1695764b34c5',
  //       // '64798212-7465-4003-9798-1d4c23e7fb03',
  //     ], // Thay đổi ví dụ thành number[] để phù hợp với thực tế
  //     required: true,
  //   })
  //   @IsOptional()
  //   @IsArray()
  //   @IsString({ each: true }) // Thay đổi thành IsNumber cho number[]
  //   customer_ids: string[]; // Thay đổi thành number[] để phù hợp với cơ sở dữ liệu
}
