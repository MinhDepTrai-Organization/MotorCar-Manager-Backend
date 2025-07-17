import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSpecificationDto {
  @IsString()
  @ApiProperty({
    description: 'Tên thuộc tính',
    example: 'Màu sắc',
  })
  @IsNotEmpty()
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Giá trị thuộc tính',
    example: 'Đỏ',
  })
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'ID của sản phẩm',
    example: 'product_01',
  })
  @IsUUID()
  productId: string;
}
