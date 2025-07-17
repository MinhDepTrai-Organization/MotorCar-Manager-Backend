import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { payment_method_name } from 'src/constants/order_status.enum';

export class CreatePaymentMethodDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the payment method',
    example: payment_method_name.COD,
    enum: payment_method_name,
  })
  name: payment_method_name;
  @IsOptional()
  @ApiProperty({
    description: 'Description of the payment method',
    example: 'VNPAY payment method',
  })
  description?: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    description: 'Logo url of the payment method',
    example: 'https://vnpay.vn/logo.png',
  })
  logo: string;
}
