import { PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @ApiProperty({
    example: 'Kho mới edit',
    description: 'Tên kho  (có thể cập nhật)',
    required: false,
  })
  name?: string;
}
