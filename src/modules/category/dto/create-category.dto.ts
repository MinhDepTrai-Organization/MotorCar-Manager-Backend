import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Xe máy điện',
    description: 'Tên của danh mục sản phẩm',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'slug',
    description: 'slug',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    example: 'Loại máy xe chất lượng cao',
    description: 'Mô tả về danh mục sản phẩm',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: null,
    description:
      'ID của danh mục cha nếu có. Nếu là danh mục cha, giá trị là null. Nếu là danh mục con của thằng khác thì thêm Id thằng cha đó.',
    required: false,
  })
  @IsOptional()
  parentCategoryId?: number;
}
