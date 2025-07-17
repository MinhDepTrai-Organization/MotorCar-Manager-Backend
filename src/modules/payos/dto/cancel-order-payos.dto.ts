import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

class CancelOrderPayosDto {
  @IsOptional()
  @ApiProperty({
    name: 'cancellationReason',
    description: 'Lý do huỷ đơn hàng',
    required: false,
  })
  @IsString()
  cancellationReason?: string;
}

export default CancelOrderPayosDto;
