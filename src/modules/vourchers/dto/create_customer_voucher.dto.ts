import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
  IsEnum,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer'; // Import Transform và Type
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomer_VourcherDto {
  @ApiProperty({
    description: 'Danh sách ID của các khách hàng nhận voucher',
    example: [
      '1c8c53b1-be42-43a9-b37f-2f2e3ede61b2',
      // 'f5f10860-0043-4a59-b988-1695764b34c5',
      // '64798212-7465-4003-9798-1d4c23e7fb03',
    ], // Thay đổi ví dụ thành number[] để phù hợp với thực tế
    required: true,
  })
  @IsArray()
  @IsString({ each: true }) // Thay đổi thành IsNumber cho number[]
  customer_ids: string[]; // Thay đổi thành number[] để phù hợp với cơ sở dữ liệu
}
