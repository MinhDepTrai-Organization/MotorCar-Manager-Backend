import { ApiProperty } from '@nestjs/swagger';
export class SkuDto1 {
  @ApiProperty({ example: '650f18cb-7d6a-4ad5-aac7-ad90a2ce8a9f' })
  id: string;

  @ApiProperty({ example: 'Xe Xanh XL' })
  name: string;
}

export class CartDataDto1 {
  @ApiProperty({ example: '54ee9813-b78d-4842-8532-141ea91a4999' })
  id: string;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ type: () => SkuDto1 })
  skus: SkuDto1;

  @ApiProperty({ example: '2025-03-08T00:42:37.502Z' })
  updatedAt: string;
}
//////
export class Response_AddCart_DTO {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Thành công thêm vào giỏ hàng' })
  message: string;

  @ApiProperty({
    description: 'Dữ liệu giỏ hàng sau khi thêm thành công',
    type: () => CartDataDto1,
  })
  data: CartDataDto1;
}
/////