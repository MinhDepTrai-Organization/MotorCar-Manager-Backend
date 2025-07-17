import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum } from 'src/constants/role.enum';

export class UpdateUserDto {
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
  @ApiProperty({ example: 18 })
  @IsOptional()
  @IsNumber()
  age: number;

  @ApiProperty({ example: 'Gia ninh' })
  @IsOptional()
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
  @IsString({ message: 'Url  must be a string' })
  avatarUrl: string;

  // @ApiProperty({
  //   example: 'admin',
  // })
  // @IsOptional()
  // @IsString()
  // Roles: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  @ApiProperty({
    name: 'role',
    required: false,
    description: 'Phân quyền cho người dùng',
    example: RoleEnum.ADMIN,
  })
  Roles?: RoleEnum;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh phải đúng định dạng YYYY-MM-DD' })
  @ApiProperty({ example: '2000-12-31' })
  birthday: Date;
}

export class UpdateUserRoleDto {
  @IsOptional()
  @IsEnum(RoleEnum)
  @ApiProperty({
    name: 'role',
    required: false,
    description: 'Phân quyền cho người dùng',
    example: RoleEnum.ADMIN,
  })
  Roles?: RoleEnum;
}
