import { ApiProperty } from '@nestjs/swagger';
import { CreateProductVariantDto } from './create-product-variants.dto';
import { UpdateProductDto } from './update-product.dto';

export class ListProductAdminDTO {
  @ApiProperty({
    example: '2032201b-28e5-403c-8787-4f6308fd30a7',
    description: 'ID của sản phẩm',
  })
  product_id: string;

  @ApiProperty({
    example: 'Xe ô tô Vinfast',
    description: 'Tiêu đề của sản phẩm',
  })
  product_title: string;

  @ApiProperty({
    example: '44d018c0-603f-47b0-9ea4-256fed4d9cc7',
    description: 'ID của thương hiệu',
  })
  brand_id: string;

  @ApiProperty({
    example: '821888a8-544c-4793-8cf3-0d1a877e15b5',
    description: 'ID của danh mục',
  })
  category_id: string;

  @ApiProperty({
    example: 'Apple',
    description: 'Tên thương hiệu',
  })
  brand_name: string;

  @ApiProperty({
    example: 'Xe máy điện',
    description: 'Tên danh mục',
  })
  category_name: string;

  @ApiProperty({
    example: '1',
    description: 'Tổng số biến thể của sản phẩm',
  })
  total_variants: string;

  @ApiProperty({
    example: '1000',
    description: 'Tổng số lượng hàng tồn kho',
  })
  total_stock: string;

  @ApiProperty({
    example: '0',
    description: 'Tổng số lượng đã bán',
  })
  total_sold: string;
}

export class ResponseListProductAdminDTO {
  @ApiProperty({
    example: 200,
  })
  status: number;
  @ApiProperty({
    example: 'Lấy danh sách thành công',
  })
  message: 'Products fetched successfully';
  @ApiProperty({
    type: [ListProductAdminDTO],
  })
  data: ListProductAdminDTO[];
}

export class ResponseUpdateProductDto {
  @ApiProperty({
    example: 200,
  })
  status: number;
  @ApiProperty({
    example: 'Cập nhật sản phẩm thành công',
  })
  message: String;

  @ApiProperty({
    type: [UpdateProductDto],
  })
  data: UpdateProductDto[];
}
