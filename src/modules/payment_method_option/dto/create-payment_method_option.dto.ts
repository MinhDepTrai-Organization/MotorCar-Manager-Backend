import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';

export class CreatePaymentMethodOptionDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the payment method option',
    type: String,
    required: true,
    example: 'm_refund_id',
  })
  name: string;

  @IsOptional()
  @ApiProperty({
    description: 'Description of the payment method option',
    type: String,
    required: false,
    example: 'Refund ID of zalo pay',
  })
  description: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Payment method id',
    type: String,
    required: true,
    example: 'd0b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b',
  })
  @IsUUID()
  paymentMethodId: string;
}
