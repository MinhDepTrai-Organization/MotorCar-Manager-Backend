import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class RefundOrderDto {
  @Expose()
  @ApiProperty({
    description: 'id record refund',
    type: Number,
    example: 12345,
  })
  id: number;
  @ApiProperty({
    description: 'ID của đơn hàng',
    type: String,
    format: 'uuid',
    example: '12345',
  })
  @Expose()
  orderId: string;
  @ApiProperty({
    description: 'mã refund dùng để truy vấn trạng thái refund',
    type: String,
    example: '12345',
  })
  @Expose()
  m_refund_id: string;
  @ApiProperty({
    description: 'Số tiền refund',
    type: Number,
    example: 100000,
  })
  @Expose()
  amount: number;
  @ApiProperty({
    description: 'Thời gian tạo refund',
    type: Number,
    format: 'timestamp',
    example: 1630924800,
  })
  @Expose()
  timestamp: number;

  @ApiProperty({
    description: 'Mô tả refund',
    type: String,
    example: 'reason why refund',
  })
  @Expose()
  reason: string;
}

export class ResponseZaloPay {
  @Expose()
  @ApiProperty({
    description: 'Mã lỗi hoàn tiền',
    example: 1,
  })
  return_code: number;

  @Expose()
  @ApiProperty({
    description: 'Thông tin trạng thái',
    example: 'Hoàn tiền thành công',
  })
  return_message: string;
  @Expose()
  @ApiProperty({
    description: 'Thông tin chi tiết mã lỗi hoàn tiền',
    example: 1,
  })
  sub_return_code: number;
  @Expose()
  @ApiProperty({
    description: 'Thông tin chi tiết trạng thái',
    example: 'Hoàn tiền thành công',
  })
  sub_return_message: string;
  @Expose()
  @ApiProperty({
    description: 'Mã giao dịch hoàn tiền của ZaloPay, cần lưu lại để đối chiếu',
    example: 12345,
  })
  refund_id: number;
}

export class ResponseZaloPayRefundOrderDto {
  @Expose()
  @Type(() => RefundOrderDto)
  @ApiProperty({
    type: RefundOrderDto,
  })
  refundOrder: RefundOrderDto;

  @Expose()
  @Type(() => ResponseZaloPay)
  @ApiProperty({
    type: ResponseZaloPay,
  })
  response: ResponseZaloPay;
}
