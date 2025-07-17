import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateImagesVideoDto } from 'src/modules/images_videos/dto/create-images_video.dto';

export class CreateReviewDto {
  @ApiProperty({ example: 5, description: 'Rating của sản phẩm (1-5)' })
  @IsNumber()
  review_rating: number;

  @ApiProperty({
    example: 'Sản phẩm rất tốt!',
    description: 'Bình luận của người dùng',
    required: false,
  })
  @IsString()
  @IsOptional()
  review_comment?: string;

  @ApiProperty({
    example: 'ad86f771-55a0-4e0d-8a25-fcb1926df65e',
    description: 'ID của sản phẩm',
  })
  @IsUUID()
  product_id: string;

  
  @ApiProperty({
    example: 'e1ee6026-142d-40d4-a445-258d3f9a9d30',
    description: 'ID của đơn hàng',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  order_id?: string;

  @ApiProperty({
    type: [CreateImagesVideoDto],
    description: 'Danh sách ảnh hoặc video minh họa',
    required: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateImagesVideoDto)
  @IsOptional()
  images_videos?: CreateImagesVideoDto[];
}
