import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { DetailImportDto } from 'src/modules/detail_import/dto/create-detail_import.dto';

export class CreateImportDto {
  @ApiProperty({ example: 'Nhập hàng vào kho' })
  @IsOptional()
  note?: string;

  @ApiProperty({
    type: [DetailImportDto],
    example: [
      {
        skus_id: 'ea7ff96c-343f-42ba-a547-e99f5bbcf0b5',
        price_import: 200,
        quantity_import: 1500,
      },
      {
        skus_id: '53fe72f3-1936-48c7-a3f3-7a05a4f02ea0',
        price_import: 200,
        quantity_import: 1500,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailImportDto)
  detail_import: DetailImportDto[];
}
