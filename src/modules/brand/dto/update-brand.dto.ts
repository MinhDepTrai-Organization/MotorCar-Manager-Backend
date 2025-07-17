import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiProperty({
    example: 'Apple',
    description: 'Tên thương hiệu (có thể cập nhật)',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'A global technology company known for its innovative products.',
    description: 'Mô tả về thương hiệu (có thể cập nhật)',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'URL của logo thương hiệu (có thể cập nhật)',
    required: false,
  })
  thumbnailUrl?: string;
}
