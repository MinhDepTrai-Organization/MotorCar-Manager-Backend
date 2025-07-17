import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBlogCategoryDto } from './create-blog-category.dto';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class UpdateBlogCategoryDto extends PartialType(CreateBlogCategoryDto) {
  @ApiProperty({
    description: 'List of blog IDs to associate with this category',
    example: [
      'f8dcc17c-bbe3-473f-af52-50af4c99c878',
      '5b835d8a-ad59-49af-8639-b620b7a8cddd',
    ],
    required: false,
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  blogIds?: string[];
}
