import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    name: 'customer_id',
    description: 'The customer id',
    type: 'string',
    format: 'UUID',
    example: '8284b91b-7ddc-43c2-ab5f-090a1e1fbd2e',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty({
    name: 'receive_address_id',
    description: 'The receive address id',
    type: String,
    format: 'UUID',
    example: '091a0544-4520-4f1e-970a-eb035bbd14e9',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  receive_address_id?: string;

  @ApiProperty({
    name: 'total_price',
    description: 'The total price of the order',
    type: 'number',
    required: true,
    example: 250000.5,
  })
  @Type(() => Number)
  @Min(0.01)
  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @ApiProperty({
    name: 'discount_price',
    description: 'The discount price of the order',
    type: 'number',
    required: true,
    example: 25000.1,
  })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(0.01)
  discount_price: number;

  @ApiProperty({
    name: 'order_note',
    description: 'Note of the order',
    type: 'string',
    required: false,
    example: 'Please call me before delivery',
  })
  @IsOptional()
  order_note?: string;

  @ApiProperty({
    name: 'payment_method_id',
    description: 'The payment method id',
    type: 'string',
    format: 'UUID',
    example: 'bb965c19-e4b8-4675-a242-0b17ca7c5aef',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  payment_method_id: string;

  @ApiProperty({
    name: 'delivery_method_id',
    description: 'The delivery method id',
    type: 'string',
    format: 'UUID',
    example: '531f41c3-e3f2-4457-bc7c-4ed2b7127b6c',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  delivery_method_id: string;

  @ApiProperty({
    name: 'order_details',
    description: 'The order details',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        skus_id: {
          type: 'string',
          format: 'UUID',
          example: '53570830-6f25-4ca6-a745-a0e56fbeed7f',
        },
        quantity: {
          type: 'number',
          example: 3,
        },
      },
    },
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested({ each: true, message: 'order_details must be an array' })
  @Type(() => order_detail_dto)
  order_details: order_detail_dto[];
}

export class order_detail_dto {
  @ApiProperty({
    name: 'skus_id',
    description: 'The skus id',
    type: 'string',
    format: 'UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty({
    message: 'skus_id is required',
  })
  @IsUUID(4, {
    message: 'skus_id must be UUID_V4 format',
  })
  skus_id: string;

  @ApiProperty({
    name: 'quantity',
    description: 'The quantity of the product',
    type: 'number',
    required: true,
    example: 2,
  })
  @IsNotEmpty({
    message: 'quantity is required',
  })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
    },
    {
      message: 'quantity must be a number',
    },
  )
  @Type(() => Number)
  quantity: number;
}
