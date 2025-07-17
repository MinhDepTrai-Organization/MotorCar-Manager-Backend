import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateDetailExportDto } from 'src/modules/detail_export/dto/create-detail_export.dto';
import { DetailExport } from 'src/modules/detail_export/entities/detail_export.entity';

export class CreateExportDto {
  @ApiProperty({
    example: 'Luân chuyển kho A sang kho B ',
    description: 'Ghi chú cho phiếu xuất',
  })
  @IsString()
  note: string;

  @ApiProperty({
    type: [CreateDetailExportDto],
    description: 'Danh sách chi tiết nhập kho',
  })
  @IsArray()
  @ValidateNested({ each: true })
  // Dùng để validate một object lồng trong object khác.
  @Type(() => CreateDetailExportDto)
  detail_export?: CreateDetailExportDto[];

  @ApiProperty({
    example: '321799f4-5737-402f-ba4a-524fc952224b',
    description: 'ID kho nhập KHO B',
  })
  @IsOptional()
  warehouse_id_import: string;
}

// @ValidateNested: Validate object lồng nhau.
// @Type: Biến dữ liệu thành class cụ thể để chạy validation chính xác.

// Tạo phiếu xuất theo đơn
export class CreateExportOrderDto {
  @ApiProperty({
    example: 'Xuất đơn hàng cho khách',
    description: 'Ghi chú cho phiếu xuất',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    example: 'e1ee6026-142d-40d4-a445-258d3f9a9d30',
    description: 'id đơn hàng',
  })
  @IsString()
  order_id: string;

  @ApiProperty({
    type: [CreateDetailExportDto],
    description: 'Danh sách chi tiết nhập kho',
  })
  @IsArray()
  @ValidateNested({ each: true })
  // Dùng để validate một object lồng trong object khác.
  @Type(() => CreateDetailExportDto)
  detail_export?: CreateDetailExportDto[];
}

export class CreateMultipleExportDto {
  @ApiProperty({
    example: 'Luân chuyển kho A sang kho B ',
    description: 'Ghi chú cho phiếu xuất',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    type: [CreateDetailExportDto],
    description: 'Danh sách chi tiết nhập kho',
  })
  @IsArray()
  @ValidateNested({ each: true })
  // Dùng để validate một object lồng trong object khác.
  @Type(() => CreateDetailExportDto)
  detail_export?: CreateDetailExportDto[];
}
