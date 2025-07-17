import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
export class CreateZaloPaymentDto {
  @ApiProperty({
    description: 'ID đơn hàng',
    example: '12345',
  })
  @IsNotEmpty({ message: 'orderId không được để trống' })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Mô tả giao dịch',
    example: 'Thanh toán đơn hàng #12345',
  })
  @IsNotEmpty({ message: 'description không được để trống' })
  @IsString()
  description: string;

  @ApiProperty({
    name: 'voucherIds',
    description: 'Danh sách ID voucher áp dụng cho đơn hàng',
    example: ['voucher1', 'voucher2'],
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { each: true, message: 'voucherIds phải là UUID hợp lệ' })
  voucherIds?: string[];
}
