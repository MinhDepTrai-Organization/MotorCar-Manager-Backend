import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ResponsePaymentMethodDto {
  @Expose()
  @ApiProperty({
    example: '1',
    description: 'The id of the payment method',
  })
  id: string;

  @Expose()
  @ApiProperty({ example: 'VNPAY' }) // Thêm nếu muốn hiển thị ví dụ trong Swagger
  name: string;

  @Expose()
  @ApiProperty({ example: 'VNPAY payment method', required: false })
  description?: string;

  @Expose()
  @ApiProperty({ example: 'https://vnpay.vn/logo.png', required: false })
  logo?: string;

  @Expose()
  @ApiProperty({ example: '2023-01-01T00:00:00Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2023-01-02T00:00:00Z' })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ example: null, required: false })
  deletedAt: Date;
}
