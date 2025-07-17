import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateImagesVideoDto {
  @ApiProperty({
    example: 'https://example.com/image1.jpg',
    description: 'URL của hình ảnh hoặc video minh họa',
  })
  @IsString()
  UrlImage: string;

  @ApiProperty({
    example: 'image',
    description: 'Loại nội dung: image hoặc video',
  })
  @IsString()
  type: string;
}
