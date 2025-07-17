import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTypeVoucherDto {
  @ApiProperty({
    description: 'Tên loại voucher',
    example: ' Voucher tri ân khách hàng ',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name_type_voucher: string;
}
