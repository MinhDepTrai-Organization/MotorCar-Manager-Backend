import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreatePayOsOrderDto {
  @ApiProperty({
    description: 'ID đơn hàng',
    example: '',
  })
  @IsNotEmpty({ message: 'orderId không được để trống' })
  @IsUUID()
  orderId: string;

  @ApiProperty({
    description: 'Mô tả giao dịch',
    example: '',
  })
  @IsOptional()
  description?: string;
  @ApiProperty({
    name: 'voucherIds',
    description: 'Danh sách ID voucher áp dụng cho đơn hàng',
    example: [''],
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { each: true, message: 'voucherIds phải là UUID hợp lệ' })
  voucherIds?: string[];
}
