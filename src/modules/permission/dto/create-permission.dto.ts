import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên quyền không được để trống' })
  @ApiProperty({
    description: 'Tên của quyền',
    example: 'READ_USER',
    required: true,
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Path không được để trống' })
  @ApiProperty({
    description: 'Đường dẫn API',
    example: '/users',
    required: true,
  })
  path: string;

  @IsString()
  @IsNotEmpty({ message: 'Method không được để trống' })
  @ApiProperty({
    description: 'Phương thức HTTP',
    example: 'GET',
    required: true,
  })
  method: string;

  // @IsString()
  // @ApiProperty({
  //   description: 'Mô tả về quyền (tuỳ chọn)',
  //   example: 'Cho phép đọc thông tin người dùng',
  //   required: false,
  // })
  // description?: string;

  @IsString()
  @ApiProperty({
    description: 'Module',
    example: 'Product',
    required: false,
  })
  module?: string;
}
