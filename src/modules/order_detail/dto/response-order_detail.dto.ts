import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { Skus } from 'src/modules/skus/entities/skus.entity';

export class ResponseOrderDetailDto {
  @ApiProperty({
    description: 'The order detail id',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The order id',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  order_id: string;

  @Expose()
  @ApiProperty({
    description: 'The skus information',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      masku: '123-1xsa',
      barcode: '123-1xsa.123',
      name: 'Product name',
      pricesold: 100000,
      image: 'https://example.com/image.jpg',
      status: true,
      product_id: '123e4567-e89b-12d3-a456-426614174000',
      product_title: 'Product title',
    },
  })
  @Transform(({ obj }) => {
    if (obj.skus) {
      const skus = obj.skus;
      return skus;
    }
  })
  skus: Skus;

  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    description: 'The quantity of the product',
    example: 1,
  })
  @Expose()
  quantity: number;

  @ApiProperty({
    description: 'The created date',
    format: 'date-time',
    example: '2021-09-02T07:45:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'The updated date',
    format: 'date-time',
    example: '2021-09-02T07:45:00.000Z',
  })
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    description: 'The deleted date',
    format: 'date-time',
    example: '2021-09-02T07:45:00.000Z',
  })
  deletedAt: Date | null;
}
