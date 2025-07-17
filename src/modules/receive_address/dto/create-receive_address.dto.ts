import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateReceiveAddressDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    name: 'customerId',
    description: "The customer's id",
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  customerId: string;

  @IsNotEmpty()
  @ApiProperty({
    name: 'receiver_name',
    description: "The receiver's name",
    type: 'string',
    example: 'John Doe',
    required: true,
  })
  receiver_name: string;

  @IsNotEmpty()
  @MaxLength(15)
  @ApiProperty({
    name: 'receiver_phone',
    description: "The receiver's phone number",
    type: 'string',
    example: '0909123456 or +84905393042',
    required: true,
  })
  receiver_phone: string;

  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty({
    name: 'street',
    description: 'Name of the street',
    type: 'string',
    example: '182 Phan Chau Trinh',
    required: true,
  })
  street: string;

  @MaxLength(100)
  @IsNotEmpty()
  @ApiProperty({
    name: 'ward',
    description: 'Name of the ward',
    type: 'string',
    example: 'Hoa Cuong Nam',
    required: true,
  })
  ward: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    name: 'district',
    description: 'Name of the district',
    type: 'string',
    example: 'Hai Chau',
    required: true,
  })
  district: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    name: 'province',
    description: 'Name of the province',
    type: 'string',
    example: 'Da Nang',
    required: true,
  })
  province: string;

  @MaxLength(10)
  @IsOptional()
  @ApiProperty({
    name: 'postal_code',
    description: 'Postal code of the province',
    type: 'string',
    example: '550000',
    required: false,
  })
  postal_code?: string;

  @IsOptional()
  @ApiProperty({
    name: 'note',
    description: 'Additional note',
    type: 'string',
    example: 'Please call before delivery',
    required: false,
  })
  note?: string;
}
