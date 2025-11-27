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
  @IsOptional()
  @IsString({ message: 'Username phải là chuỗi hợp lệ' })
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Địa chỉ email của người dùng',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email phải hợp lệ' })
  email: string;

  @ApiProperty({ example: 'P@ssw0rd', description: 'Password người dùng' })
  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString({ message: 'Password phải là chuỗi hợp lệ' })
  @MinLength(6, { message: 'Password phải ít nhất 6 kí tự' })
  password: string;
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
  password: string;
}

export class ActiveAccount {
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

export class ChangeAcount {
  @ApiProperty({
    description: 'Mã codeId của tài khoản',
    example: '1234',
  })
  @IsNotEmpty({ message: 'Không đươc để trống' })
  @IsString()
  codeId: string;

  @ApiProperty({
    description: 'mail của tài khoản',
    example: 'nguyenvanhuy20053012@gmail.com',
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
