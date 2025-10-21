import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class VerifyResetPasswordDto {
  @ApiProperty({
    name: 'token',
    description: 'token xác thực',
    type: String,
    example: '',
  })
  @IsNotEmpty({
    message: 'Token đang bị thiếu',
  })
  @IsString({
    message: 'Token không hợp lệ',
  })
  token: string;
}
