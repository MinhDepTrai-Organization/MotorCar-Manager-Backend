import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'Số lượng sản phẩm trong giỏ hàng',
    example: 2,
  })
  @IsInt()
  quantity: number;

  @ApiProperty({
    description: 'ID của SKU sản phẩm',
    example: '650f18cb-7d6a-4ad5-aac7-ad90a2ce8a9f',
  })
  @IsString()
  sku_id: string;
}
