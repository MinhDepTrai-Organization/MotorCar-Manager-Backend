import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateImagesVideoDto } from 'src/modules/images_videos/dto/create-images_video.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({
    example: 5,
    description: 'Điểm đánh giá sản phẩm (1-5)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  review_rating?: number;

  @ApiProperty({
    example: 'Sản phẩm rất tốt, mình rất hài lòng!',
    description: 'Bình luận về sản phẩm',
    required: false,
  })
  @IsString()
  @IsOptional()
  review_comment?: string;

  @ApiProperty({
    type: [CreateImagesVideoDto],
    description: 'Danh sách ảnh hoặc video kèm theo đánh giá',
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateImagesVideoDto)
  @IsOptional()
  images_videos?: CreateImagesVideoDto[];
}
