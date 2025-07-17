import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseCheckRefundDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Mã đơn hàng',
    example: 'fb25f297-cc42-47f5-9031-bf75c3f70ec9',
  })
  orderId: string;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Mã trạng thái',
    example: 0,
  })
  return_code: number;
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Thông tin trạng thái',
    example: 'Thành công',
  })
  return_message: string;

  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Mã trạng thái chi tiết',
    example: -58,
  })
  sub_return_code: number;
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Mô tả chi tiết mã trạng thái',
    example: 'Thành công',
  })
  sub_return_message: string;
}
