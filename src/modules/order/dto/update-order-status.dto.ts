import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { order_status } from 'src/constants/order_status.enum';

export class UpdateSpecialOrderStatusDto {
  @ApiProperty({
    name: 'status_code',
    description: `The order status (CANCELLED : ${order_status.CANCELLED}, FAILED_DELIVERY: ${order_status.FAILED_DELIVERY}`,
    type: 'number',
    example: order_status.CANCELLED,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum([order_status.CANCELLED, order_status.FAILED_DELIVERY], {
    message: `status_code must be in [${order_status.CANCELLED}, ${order_status.FAILED_DELIVERY}]`,
  })
  status_code: order_status;

  @ApiProperty({
    name: 'reason',
    description: 'The reason for changing the order status',
    type: 'string',
    example: 'The customer not receive order',
    required: true,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class CancelOrderDto {
  @ApiProperty({
    name: 'reason',
    description: 'The reason for canceling the order',
    type: 'string',
    example: "I don't want it anymore",
    required: true,
  })
  @IsOptional()
  reason: string;
}
