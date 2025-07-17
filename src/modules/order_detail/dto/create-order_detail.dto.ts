import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDetailDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'The order id',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  order_id: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'The skus id',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  skus_id: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    description: 'The quantity of the product',
    example: 1,
  })
  quantity: number;
}
