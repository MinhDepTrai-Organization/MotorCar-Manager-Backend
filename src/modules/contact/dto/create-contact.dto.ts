import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { EnumContact } from '../entities/contact.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Enum } from '@solana/web3.js';

export default class CreateContactDto {
  @IsString()
  @IsNotEmpty({
    message: 'Vui lòng nhập tên người liên hệ',
  })
  @ApiProperty({
    type: String,
    description: 'Tên của người liên hệ',
    example: '',
    required: true,
  })
  name: string;

  @IsPhoneNumber('VN', {
    message: 'Số điện thoai không hợp lệ, vui lòng nhập lại',
  })
  @IsNotEmpty({
    message: 'Vui lòng nhập số điện thoại',
  })
  @ApiProperty({
    type: String,
    description: 'Số điện thoại của người liên hệ',
    example: '',
    required: true,
  })
  phone: string;

  @IsNotEmpty({
    message: 'Vui lòng nhập email',
  })
  @IsEmail(
    {},
    {
      message: 'Email không hợp lệ, vui lòng nhập lại',
    },
  )
  @ApiProperty({
    type: String,
    description: 'Email của người liên hệ',
    example: '',
    required: true,
  })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Ghi chú hoặc thông tin bổ sung',
    example: '',
    required: false,
  })
  note?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Tên sản phẩm liên quan đến yêu cầu',
    example: '',
    required: false,
  })
  product_name?: string;

  @IsEnum(EnumContact, {
    message: 'Vui lòng chọn một trong các dịch vụ: QUOTE, ORDER, MAINTENANCE',
  })
  @ApiProperty({
    type: Enum,
    enum: EnumContact,
    description: 'Dịch vụ liên quan đến yêu cầu',
    example: EnumContact.Quote,
    required: true,
  })
  service: EnumContact;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Ngày bảo trì hoặc dịch vụ liên quan',
    example: '20/10/2023, 10:00 AM',
    required: false,
  })
  maintenance_date?: string;
}
