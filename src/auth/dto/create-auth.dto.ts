import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {}

export class UserInfo {



  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Tên người dùng',
  })
  @IsNotEmpty({ message: 'Username should not be empty' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Địa chỉ email của người dùng',
  })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ example: 'P@ssw0rd', description: 'Password người dùng' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  // @Matches(/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
  //   message:
  //     'Password must include at least one uppercase letter, one number, and one special character',
  // })
  password: string;

  @IsOptional()
  @IsBoolean() // Xác minh đây là kiểu boolean nếu có giá trị
  isActive: boolean;

  @IsOptional()
  @IsString() // Xác minh đây là chuỗi nếu có giá trị
  codeId: string;

  @IsOptional()
  @IsDate() // Xác minh đây là kiểu Date nếu có giá trị
  codeExprided: Date;
}

export class ConfirmInfo {
  @ApiProperty()
  @IsNotEmpty()
  wallet: string;

  @ApiProperty()
  @IsNotEmpty()
  isLedger: boolean;

  @ApiProperty()
  @IsNotEmpty()
  signature: string;

  @ApiProperty()
  @IsNotEmpty()
  nonce: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'ngodinhphuoc100@gmail.com',
    description: 'Tên người dùng',
  })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Password người dùng' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  // @Matches(/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
  //   message:
  //     'Password must include at least one uppercase letter, one number, and one special character',
  // })
  password: string;
}

export class getAccountDto {
  @ApiProperty({
    example: 'ngodinhphuoc100@gmail.com',
    description: 'Tên người dùng',
  })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;


}

export class ActiveAcount {
  @ApiProperty({
    description: 'Mã codeId của tài khoản',
    example: '1982', // Ví dụ cho field này
  })
  @IsNotEmpty({ message: 'Không đươc để trống' })
  @IsString()
  codeId: string;

  @ApiProperty({
    description: 'ID của người dùng lúc register trả về data',
    example: '07c95509-7d5d-4597-9423-a08d7006172a', // Ví dụ cho field này
  })
  @IsNotEmpty({ message: 'Id khổng được để trống' })
  id: string;
}
export class Email {
  @ApiProperty({
    description: 'Email của tài khoản',
    example: 'nguyenvanhuy20053012@gmail.com', // Ví dụ cho field này
  })
  @IsNotEmpty({ message: 'Không đươc để trống' })
  @IsString()
  email: string;
}

export class ChangeAcount {
  @ApiProperty({
    description: 'Mã codeId của tài khoản',
    example: '1234', // Ví dụ cho field này
  })
  @IsNotEmpty({ message: 'Không đươc để trống' })
  @IsString()
  codeId: string;

  @ApiProperty({
    description: 'mail của tài khoản',
    example: 'nguyenvanhuy20053012@gmail.com', // Ví dụ cho field này
  })
  @IsNotEmpty({ message: 'Không đươc để trống' })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'confirmpassword',
    example: '123456', // Ví dụ cho field này
  })
  @IsNotEmpty({ message: ' khổng được để trống' })
  confirmpassword: string;

  @ApiProperty({
    description: 'password',
    example: '123456', // Ví dụ cho field này
  })
  @IsNotEmpty({ message: ' khổng được để trống' })
  password: string;
}
