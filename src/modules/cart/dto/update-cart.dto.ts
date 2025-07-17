import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({
    example: 5,
    description: 'Số lượng mới của sản phẩm trong giỏ hàng (0 để xóa)',
    type: 'number',
  })
  @IsNumber({}, { message: 'Quantity phải là một số' })
  @Min(0, { message: 'Quantity không được nhỏ hơn 0' })
  quantity: number;
}
