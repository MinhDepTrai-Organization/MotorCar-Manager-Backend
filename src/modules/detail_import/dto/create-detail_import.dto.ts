import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class DetailImportDto {
  @ApiProperty({ example: 'ea7ff96c-343f-42ba-a547-e99f5bbcf0b5' })
  @IsUUID()
  skus_id: string;

  @ApiProperty({ example: 200 })
  @IsNumber()
  price_import: number;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  quantity_import: number;

  @ApiProperty({ example: '74f68f7c-a9a9-41ed-a5ec-132a93051abb' })
  @IsUUID()
  warehouse_id: string;

  @ApiProperty({
    example: '',
    description:
      'Tên lô hàng, có thể là tên của sản phẩm hoặc tên khác mà bạn muốn đặt cho lô hàng này.',
  })
  @IsString()
  @IsOptional()
  lot_name?: string;
}
