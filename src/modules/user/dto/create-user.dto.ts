import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { RoleEnum } from 'src/constants/role.enum';
export class CreateUserDto {
  // @ApiProperty({ example: 'admin' })
  // @IsOptional()
  // @IsIn(['admin', 'delivery_staff', 'Staff', 'warehouse_manager'], {
  //   message: 'role must be either Admin or sale or manager or staff',
  // })
  // role?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  @ApiProperty({
    name: 'role',
    required: false,
    description: 'Phân quyền cho người dùng',
    example: RoleEnum.ADMIN,
  })
  role?: RoleEnum;

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
  // @ApiProperty({ example: 'P@ssw0rd', description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  // @ApiProperty({ example: 18 })
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

  @IsOptional() // Không bắt buộc nhập
  @IsDateString({}, { message: 'Ngày sinh phải đúng định dạng YYYY-MM-DD' }) // Kiểm tra đúng định dạng
  @ApiProperty({ example: '2000-12-31' }) // Cung cấp ví dụ rõ ràng
  birthday: Date;
}

// tạo từ đăng nhập gmail

export class CreateUserGmailDto {
  //   @ApiProperty({ example: 'laskdflaskjva234jhas' })
  //   @IsNotEmpty({ message: 'wallet address should not be empty' })
  //   walletAddress: string;

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
  @ApiProperty({ example: '0865446276' })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\d{10,11}$/, {
    message: 'Phone number must be 10 or 11 digits long',
  })
  phoneNumber: string;

  @Optional()
  @ApiProperty({ example: '' })
  @IsNotEmpty({ message: 'url ảnh ' })
  @IsString({ message: 'url là string ' })
  avatarUrl: string;

  @IsOptional() // Không bắt buộc nhập
  @IsDateString({}, { message: 'Ngày sinh phải đúng định dạng YYYY-MM-DD' }) // Kiểm tra đúng định dạng
  @ApiProperty({ example: '2000-12-31' }) // Cung cấp ví dụ rõ ràng
  birthday: Date;
}
