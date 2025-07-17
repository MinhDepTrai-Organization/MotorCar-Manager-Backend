import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

class OptionValuesDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Danh sách ID của các giá trị tùy chọn',
    example: [''],
    type: [String],
  })
  @IsUUID(4, { each: true })
  option_value_ids: string[];
}

export default class GetSkusByOptionValuesIdsDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    type: [OptionValuesDto],
    description: 'Danh sách các tùy chọn và giá trị tùy chọn để lấy SKU',
    example: [
      {
        option_value_ids: ['ce74692b-f3d5-4cb5-8131-4ea892d17ddc'],
      },
      {
        option_value_ids: ['7e963a8a-4d82-4fa2-a5a0-783884c1a345'],
      },
    ],
  })
  optionValues: OptionValuesDto[];
}
