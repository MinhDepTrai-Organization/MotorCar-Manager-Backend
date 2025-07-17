import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class ResponseBlogDto {
  @ApiProperty({
    description: 'The id of the blog',
    example: 'ac813dec-6d03-4cc6-8bd0-953a3ac752f1',
  })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The title of the blog',
    example: 'This is blog tittle',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'The thumbnail of the blog',
    example: 'thumbnail.jpg',
  })
  @Expose()
  thumbnail: string;

  @ApiProperty({
    description: 'The content of the blog',
    example: '<h1>This is blog tittle</h1>',
  })
  @Expose()
  content: string;

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Blog images',
  })
  @Expose()
  blogImages?: string[];

  @ApiProperty({ example: 'blog-slug', description: 'The slug of the blog' })
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'The id of the blog category',
    example: 'ac813dec-6d03-4cc6-8bd0-953a3ac752f1',
  })
  @IsUUID()
  @Expose()
  @Transform(({ obj }) => obj.blogCategory?.id || null)
  blogCategoryId: string;

  @ApiProperty({
    description: 'The id of the customer',
    example: 'ac813dec-6d03-4cc6-8bd0-953a3ac752f1',
  })
  @IsUUID()
  @Expose()
  @Transform(({ obj }) => obj.customer?.id || null)
  customerId: string;

  @ApiProperty({
    description: 'The create date of the blog',
    example: '2021-09-29T07:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'The update date of the blog',
    example: '2021-09-29T07:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date | null;
}

export class UploadImageReponseDto {
  @ApiProperty({ description: 'public id of image' })
  public_id: string;

  @ApiProperty({ description: 'public url of image' })
  url: string;
}
