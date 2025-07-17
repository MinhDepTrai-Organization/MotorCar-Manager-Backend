import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ResponseReceiveAddressDto {
  @Expose()
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'The address id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  id: string;
  @Expose()
  @Transform(({ obj }) => {
    if (obj?.customer) {
      return obj.customer.id;
    }
  })
  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'The customer id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  customerId: string;
  @Expose()
  @ApiProperty({
    name: 'receiver_name',
    description: "The receiver's name",
    type: String,
    example: 'Minh dep trai',
    required: true,
  })
  receiver_name: string;
  @Expose()
  @ApiProperty({
    name: 'receiver_phone',
    description: "The receiver's phone number",
    type: String,
    example: '0909123456 or +84905393042',
    required: true,
  })
  receiver_phone: string;
  @Expose()
  @ApiProperty({
    name: 'street',
    description: 'Name of the street',
    type: String,
    example: '182 Phan Chau Trinh',
    required: true,
  })
  street: string;
  @Expose()
  @ApiProperty({
    name: 'ward',
    description: 'Name of the ward',
    type: String,
    example: 'Hoa Cuong Nam',
    required: true,
  })
  ward: string;
  @Expose()
  @ApiProperty({
    name: 'district',
    description: 'Name of the district',
    type: String,
    example: 'Hai Chau',
    required: true,
  })
  district: string;
  @Expose()
  @ApiProperty({
    name: 'province',
    description: 'Name of the province',
    type: String,
    example: 'Da Nang',
    required: true,
  })
  province: string;
  @Expose()
  @ApiProperty({
    name: 'postal_code',
    description: 'Postal code of the province',
    type: String,
    example: '550000',
    required: false,
  })
  postal_code?: string;
  @Expose()
  @ApiProperty({
    name: 'note',
    description: 'Additional note',
    type: String,
    example: 'Please call before delivery',
    required: false,
  })
  note?: string;
  @Expose()
  is_default?: boolean;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  deletedAt: Date | null;
}
