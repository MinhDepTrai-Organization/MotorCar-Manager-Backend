import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({
    example: 'AI Technologies',
    description: 'Name of the blog category',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @ApiProperty({
    example: 'AI Technologies blog category',
    description: 'Description of the blog category',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'ai-technologies',
    description: 'Slug of the blog category',
  })
  @IsNotEmpty({
    message: 'Slug is required',
  })
  slug: string;
}
