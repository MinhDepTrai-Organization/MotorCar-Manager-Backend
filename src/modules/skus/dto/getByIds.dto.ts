import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export default class GetByIdsDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    type: [String],
    description: 'Danh sách ID của các SKU cần lấy thông tin',
    example: ['', ''],
  })
  @IsUUID('4', { each: true })
  ids: string[];
}
