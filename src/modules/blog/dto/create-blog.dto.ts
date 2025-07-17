import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    example: 'Blog title',
    description: 'The title of the blog',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'thumbnail.jpg',
    description: 'The thumbnail of the blog',
  })
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({
    example: 'This is a blog content',
    description: 'The content of the blog in html format',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'This is all the images in the content of the blog',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  blogImages?: string[];

  @ApiProperty({
    example: 'ac813dec-6d03-4cc6-8bd0-953a3ac752f1',
    description: 'The id of the blog category',
  })
  @IsNotEmpty()
  @IsUUID()
  blogCategoryId: string;

  @ApiProperty({
    example: 'ac813dec-6d03-4cc6-8bd0-953a3ac752f1',
    description: 'The id of the customer who wrote the blog',
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({
    example: 'blog-slug',
    description: 'The slug of the blog',
  })
  @IsNotEmpty()
  slug: string;
}
