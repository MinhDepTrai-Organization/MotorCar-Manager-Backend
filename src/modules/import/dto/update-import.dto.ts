import { PartialType } from '@nestjs/mapped-types';
import { CreateImportDto } from './create-import.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateDetailImportDto } from 'src/modules/detail_import/dto/update-detail_import.dto';

export class UpdateImportDto {
  @ApiProperty({ example: '' })
  @IsOptional()
  note?: string;

  @ApiProperty({
    type: [UpdateDetailImportDto],
    example: [
      {
        detail_import_id: 'ea7ff96c-343f-42ba-a547-e99f5bbcf0b5',
        price_import: 200,
        quantity_import: 1500,
        lot_name: 'Lô hàng 1',
        warehouse_id: '74f68f7c-a9a9-41ed-a5ec-132a93051abb',
      },
      {
        detail_import_id: '53fe72f3-1936-48c7-a3f3-7a05a4f02ea0',
        price_import: 200,
        quantity_import: 1500,
        lot_name: 'Lô hàng 2',
        warehouse_id: '74f68f7c-a9a9-41ed-a5ec-132a93051abb',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDetailImportDto)
  detail_import: UpdateDetailImportDto[];
}
