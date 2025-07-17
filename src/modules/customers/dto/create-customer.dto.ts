// export class CreateCustomerDto {}
import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
export class CreateCustomerDto {
  @ApiProperty({ example: 'john_doe', description: 'Tên người dùng' })
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

  @IsOptional()
  @ApiProperty({ example: 'P@ssw0rd', description: 'Mật khẩu' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @ApiProperty({ example: 18 })
  @IsNumber()
  age: number;

  @IsOptional()
  @ApiProperty({ example: 'Gia ninh' })
  @IsNotEmpty({ message: 'Address should not be empty' })
  @IsString({ message: 'Address  must be a string' })
  address: string;
  @IsOptional()
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

  @IsOptional()
  @ApiProperty({ example: 'http/...image' })
  @IsString({ message: 'url là string ' })
  avatarUrl: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Address should not be empty' })
  @IsString({ message: 'Address  must be a string' })
  codeId: string;

  @IsOptional() // Không bắt buộc nhập
  @IsDateString({}, { message: 'Ngày sinh phải đúng định dạng YYYY-MM-DD' }) // Kiểm tra đúng định dạng
  @ApiProperty({ example: '2000-12-31' }) // Cung cấp ví dụ rõ ràng
  birthday: Date;

  @IsOptional()
  @ApiProperty({ example: 'user' })
  @IsString()
  @IsIn(['user', 'sale', 'hr'], {
    message: 'Role is in user , sale , hr ',
  })
  role: string;
}

// tạo từ đăng nhập gmail

export class CreateCustomerGmailDto {
  @ApiProperty({ example: 'user Gmail' })
  @IsOptional()
  @IsIn(['user', 'admin'], { message: 'role must be either user or admin' })
  role?: string;

  @ApiProperty({ example: 'john_doe', description: 'Tên người dùng' })
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

  @Optional()
  @ApiProperty({ example: 18 })
  @IsNotEmpty({ message: 'Age should not be empty' })
  @IsNumber()
  age: number;

  @Optional()
  @ApiProperty({ example: 'Gia ninh' })
  @IsNotEmpty({ message: 'Address should not be empty' })
  @IsString({ message: 'Address  must be a string' })
  address: string;

  @Optional()
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'url ảnh ' })
  @IsString({ message: 'url là string ' })
  avatarUrl: string;
}
