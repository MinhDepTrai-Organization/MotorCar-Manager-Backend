import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export default class EmailDto {
  @ApiProperty({
    type: String,
    description: 'Email của tài khoản',
    example: '',
  })
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;
}
