import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateOrderDtoFromCart {
  @ApiProperty({
    name: 'customer_id',
    description: 'The customer id',
    type: 'string',
    format: 'UUID',
    example: '1c8c53b1-be42-43a9-b37f-2f2e3ede61b2',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @ApiProperty({
    name: 'receive_address_id',
    description: 'The receive address id',
    type: 'string',
    format: 'UUID',
    example: '0469e636-42f3-4742-9abc-654eb84728fb',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  receive_address_id: string;

  @ApiProperty({
    name: 'total_price',
    description: 'The total price of the order',
    type: 'number',
    required: true,
    example: 2500,
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
    example: 500,
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
    example: '81c07970-83cc-4432-9972-d02d83174667',
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
    name: 'cart_item_ids',
    description: 'The cart item ids',
    type: 'array',
    items: {
      type: 'string',
      format: 'UUID',
      example: 'ea7ff96c-343f-42ba-a547-e99f5bbcf0b5',
    },
    required: true,
  })
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  @IsArray()
  @Transform(({ value }) => {
    const uniqueIds = new Set(value);
    if (uniqueIds.size !== value.length) {
      throw new Error('cart_item_ids contains duplicate UUIDs');
    }

    return value;
  })
  cart_item_ids: string[];
}
