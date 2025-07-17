import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDetailExportDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    example: 'e1ee6026-142d-40d4-a445-258d3f9a9d30',
    description: 'id đơn hàng',
  })
  order_id?: string;

  @ApiProperty({ example: 10, description: 'số lượng xuất' })
  @IsInt()
  @IsNotEmpty()
  quantity_export: number;

  @ApiProperty({
    example: '242bfd37-f9a8-4649-912c-e1ef6a80f030',
    description: 'id phiếu nhập ',
  })
  @IsString()
  @IsNotEmpty()
  detail_import_id: string;

  @ApiProperty({
    example: '650f18cb-7d6a-4ad5-aac7-ad90a2ce8a9f',
    description: 'ID của SKU',
  })
  @IsString()
  @IsNotEmpty()
  skus_id: string;

  @ApiProperty({
    example: '74f68f7c-a9a9-41ed-a5ec-132a93051abb',
    description: 'ID kho xuất',
  })
  @IsString()
  @IsNotEmpty()
  warehouse_id: string;
}
