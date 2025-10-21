import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import VerifyResetPasswordDto from './verify-reset-password.dto';

export default class ResetPassword extends VerifyResetPasswordDto {
  @ApiProperty({
    example: '',
    name: 'newPassword',
    description: 'Mật khẩu mới',
  })
  @IsNotEmpty({
    message: 'Mật khẩu mới không được để trống',
  })
  newPassword: string;
}
