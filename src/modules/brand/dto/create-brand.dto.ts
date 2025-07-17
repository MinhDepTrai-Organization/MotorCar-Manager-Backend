import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    example: 'Apple',
    description: 'Tên thương hiệu',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '',
    description: 'Slug của thương hiệu',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 'A global technology company known for its innovative products.',
    description: 'Mô tả về thương hiệu',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'URL của logo thương hiệu',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}
