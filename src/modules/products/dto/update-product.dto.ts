import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @ApiProperty({ description: 'Tên sản phẩm', example: 'Toyota Camry 2024' })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description:
      'Số tiền chưa giảm giá, thể hiện giá trị giảm giá, ưu đãi cho khách hàng',
    example: 45000,
    required: false,
  })
  @IsOptional()
  price: number;

  @IsOptional()
  @ApiProperty({
    description: 'ID của thương hiệu nha cung cap',
    example: 'be1778ed-1ed6-4ffc-bb1c-ffb528c892a9',
  })
  @IsOptional()
  @IsString()
  brand_id: string; // UUID hoặc ID của brand

  @ApiProperty({
    description: 'ID của danh mục category',
    example: 'b7b5cf58-2302-4647-9d7f-af7066ab8ee4',
  })
  @IsOptional()
  @IsString()
  category_id: string; // UUID hoặc ID của category

  @ApiProperty({
    description: 'Tổng quan ',
    example:
      'Tổng quan :  Hãng sản xuất Volv Mẫu xe: XC 90 Màu sắc: trắng Loại động cơ: 4x4 hộp số',
  })
  @IsOptional()
  @ApiProperty({
    description: 'Mô tả chi tiết sản phẩm',
    example:
      'Volvo XC60 mới hoàn toàn là một SUV compact sang trọng tuyệt vời. Nó đã được thiết kế lại hoàn toàn cho năm 2017 và có các cải thiện trên toàn diện. Những thay đổi này đã đẩy xe lên từ vị trí trung bình trước đó; giờ đây nó đang cạnh tranh với một số trong những chiếc xe tốt nhất trong lớp. Một số cải thiện đáng chú ý nhất bao gồm hệ thống giải trí tiên tiến, không gian chân sau cho hành khách ngồi sau và các lựa chọn động cơ mạnh mẽ.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Sản phẩm nổi bật',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  // @ApiProperty({ description: 'Đánh giá trung bình', default: 0 })
  @IsNumber()
  @IsOptional() // Không yêu cầu client truyền giá trị, nếu không có sẽ dùng mặc định là 0
  rating: number;

  // @ApiProperty({ description: 'Số lượt đánh giá', default: 0 })
  @IsNumber()
  @IsOptional() // Không yêu cầu client truyền giá trị, nếu không có sẽ dùng mặc định là 0
  reviewsCount: number;

  @ApiProperty({
    description: 'Số lượng video liên quan đến sản phẩm',
    default: 0,

    required: false,
  })
  @IsOptional()
  @IsNumber()
  videosCount: number;

  @ApiProperty({
    description: 'Tags của sản phẩm',
    example: ['luxury', 'sedan', 'hybrid'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'URL của video sản phẩm',
    example: ['https://example.com/video1.mp4'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos: string[];

  @ApiProperty({ description: 'Trạng thái sản phẩm', example: true })
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsArray()
  images: string[];

  @ApiProperty({
    description: 'Giá tiền cọc sản phẩm',
    example: 35000,
    required: false,
  })
  @IsNumber()
  depositPrice: number;

  @ApiProperty({
    description: 'Số lượng ảnh sản phẩm',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  photosCount: number;

  @ApiProperty({
    description: 'Số khung của sản phẩm',
    example: 'ABC123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  chassisNumber: string;

  @ApiProperty({
    description: 'Số động cơ của sản phẩm',
    example: 'XYZ987654',
    required: false,
  })
  @IsOptional()
  @IsString()
  engineNumber: string;
  @ApiProperty({
    description: 'Kế hoạch đăng ký',
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true }) // Kiểm tra mỗi phần tử trong mảng là số nguyên
  subscriptionPlans: number[];

  @IsOptional()
  @ApiProperty({
    description: 'Thông số kỹ thuật sản phẩm dưới dạng JSON',
    example: [
      {
        name: 'Chiều dài x Chiều rộng x Chiều cao',
        value: '1804mm x 683mm x 1127mm',
      },
    ],
    type: 'array',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specifications: SpecificationDto[];
}
class SpecificationDto {
  @ApiProperty({
    description: 'Tên thông số',
    example: 'Chiều dài x Chiều rộng x Chiều cao',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Giá trị của thông số',
    example: '1804mm x 683mm x 1127mm',
  })
  @IsString()
  value: string;
}
