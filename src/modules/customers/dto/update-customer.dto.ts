import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Optional } from '@nestjs/common';

export class UpdateCustomerDto {
  @ApiProperty({ example: 'john_doe', description: 'Tên người dùng' })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Địa chỉ email của người dùng',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({ example: 'P@ssw0rd', description: 'Mật khẩu' })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'Password must include at least one uppercase letter, one number, and one special character',
  })
  password: string;

  // @Optional()
  @ApiProperty({ example: 'Gia ninh' })
  @IsOptional()
  @IsString({ message: 'Address  must be a string' })
  address: string;

  @Optional()
  @ApiProperty({ example: '0865446276' })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\d{10,11}$/, {
    message: 'Phone number must be 10 or 11 digits long',
  })
  phoneNumber: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Giới tính của người dùng',
    enum: ['male', 'female', 'other'],
    example: 'male',
  })
  @IsIn(['male', 'female', 'other'], {
    message: 'Gender must be male, female, or other',
  })
  gender?: 'male' | 'female' | 'other';
  @ApiProperty({
    example:
      'https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png',
  })
  @IsOptional()
  @IsString({ message: 'Url  must be a string' })
  avatarUrl: string;

  // Role
  @ApiProperty({
    example: 'user',
  })
  @IsOptional()
  @IsString({ message: 'Roles must be a string' })
  @IsIn(['user', 'hr', 'staff', 'sales'], {
    message: 'Roles chỉ có thể là user, hr hoặc staff',
  })
  Roles: string;

  @IsOptional()
  @ApiProperty({
    example: '2000-12-31', // Ví dụ đúng dạng ngày tháng
    description: 'Ngày sinh của người dùng (YYYY-MM-DD)',
  })
  @IsString({ message: 'Birthday must be a string' })
  birthday: string;
}

export class ChangePassword_Profile {
  @ApiProperty({
    description: 'confirmPassword',
    example: '123456', // Ví dụ cho field này
  })
  @IsNotEmpty({ message: ' khổng được để trống' })
  confirmPassword: string;

  @ApiProperty({
    description: 'newPassword',
    example: '123456', // Ví dụ cho field này
  })
  @IsNotEmpty({ message: ' khổng được để trống' })
  newPassword: string;

  @ApiProperty({
    description: 'oldPassword',
    example: '123456', // Ví dụ cho field này
  })
  @IsNotEmpty({ message: ' khổng được để trống' })
  oldPassword: string;
}
