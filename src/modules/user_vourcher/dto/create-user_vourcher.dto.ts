import { IsBoolean, IsDate, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserVourcherDto {
  @ApiProperty({
    description: 'ID của khách hàng nhận voucher',
    example: 1,
    required: true,
  })
  @IsInt()
  customer_id: number;

  @ApiProperty({
    description: 'ID của voucher',
    example: 1,
    required: true,
  })
  @IsInt()
  voucher_id: number;

  @ApiProperty({
    description: 'Trạng thái sử dụng của voucher',
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_used: boolean = false;

  @ApiProperty({
    description: 'Thời gian voucher được sử dụng',
    example: '2024-03-02T10:00:00Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  used_at?: Date;

  
}
