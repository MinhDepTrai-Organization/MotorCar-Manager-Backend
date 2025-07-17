import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CheckOrderStatusDto {
  @ApiProperty({
    description: 'Mã đơn hàng của đơn hàng',
    example: '12345',
  })
  @IsUUID()
  order_id: string;
}
