import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateRemainingQuantityDto {
  @ApiProperty({
    type: Array,
    description: 'Danh sách detail import id cần cật nhật số lượng còn lại',
    required: true,
    example: ['fea4fa67-a7e5-49e1-aea1-a750129365a1'],
    name: 'ids',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty({ each: true })
  @IsUUID('4', { each: true })
  ids: string[];
}
