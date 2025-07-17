import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class ZaloCreateOrder {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'URL thanh toán bằng ZaloPay',
    example:
      'https://qcgateway.zalopay.vn/openinapp?order=eyJ6cHRyYW5zdG9rZW4iOiJBQ1NNQVJsYlhrSXpjU0NOSERXQ181akEiLCJhcHBpZCI6MTI0NzA1fQ==',
  })
  cashier_order_url: string;
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Token of the zaloPay transaction',
    example: 'ACSMARlbXkIzcSCNHDWC_5jA',
  })
  zp_trans_token: string;
  @Expose()
  @ApiProperty({
    type: String,
    description: 'URL để chuyển hướng đến ZaloPay',
    example:
      'https://qcgateway.zalopay.vn/openinapp?order=eyJ6cHRyYW5zdG9rZW4iOiJBQ1NNQVJsYlhrSXpjU0NOSERXQ181akEiLCJhcHBpZCI6MTI0NzA1fQ==',
  })
  order_url: string;
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Token of the order',
    example: 'ACSMARlbXkIzcSCNHDWC_5jA',
  })
  order_token: string;
  @Expose()
  @ApiProperty({
    type: String,
    description: 'QR code',
    example:
      '00020101021226520010vn.zalopay0203001010627000503173307089089161731338580010A000000727012800069704540114998002401295460208QRIBFTTA5204739953037045405690005802VN62210817330708908916173136304409F',
  })
  qr_code: string;
}

export class ResponseZaloCreateOrder {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Mã đơn hàng',
    example: 'fb25f297-cc42-47f5-9031-bf75c3f70ec9',
  })
  orderId: string;

  @Expose()
  @ApiProperty({
    type: ZaloCreateOrder,
  })
  @Type(() => ZaloCreateOrder)
  response: ZaloCreateOrder;
}
