import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderPaymentMethodOptionDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'order id',
    required: true,
  })
  order_id: string;

  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    format: 'int',
    description: 'payment method option id',
    required: true,
  })
  @IsInt()
  payment_method_option_id: number;

  @IsNotEmpty({
    message: 'the value of the payment method option is required',
  })
  @ApiProperty({
    type: String,
    format: 'text',
    description: 'value of the payment method option',
    required: true,
  })
  value: string;
}
