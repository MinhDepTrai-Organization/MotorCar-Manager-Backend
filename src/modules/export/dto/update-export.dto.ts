import { PartialType } from '@nestjs/mapped-types';
import { CreateExportDto } from './create-export.dto';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ExportItemDto {
  @ApiProperty({
    description: 'ID chi tiết xuất kho',
    example: '46766044-0d7b-4e4f-9acb-5416bb77b80f',
  })
  @IsUUID()
  detail_export_id: string;
  @ApiProperty({
    description: 'ID chi tiết nhập kho',
    example: '242bfd37-f9a8-4649-912c-e1ef6a80f030',
  })
  @IsUUID()
  detail_import_id: string;

  @ApiProperty({ description: 'Số lượng xuất kho', example: 10 })
  @IsInt({ message: 'quantity_export phải là số nguyên' })
  quantity_export: number;
}

export class UpdateExportDto {
  @ApiProperty({
    description: 'Ghi chú',
    example: 'Ghi chú xuất kho',
  })
  @IsString()
  @IsOptional()
  note?: string;
  @ApiProperty({
    description: 'Danh sách các mặt hàng xuất kho',
    type: [ExportItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExportItemDto)
  export_details: ExportItemDto[];
}
