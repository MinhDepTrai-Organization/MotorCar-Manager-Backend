import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { CreateCartItemDto } from 'src/modules/cart_item/dto/create-cart_item.dto';

export class CreateCartDto {
  @ApiProperty({
    description: 'Thông tin chi tiết sản phẩm trong giỏ hàng',
    type: CreateCartItemDto,
  })
  @ValidateNested()
  @Type(() => CreateCartItemDto)
  cart_item: CreateCartItemDto;
}
