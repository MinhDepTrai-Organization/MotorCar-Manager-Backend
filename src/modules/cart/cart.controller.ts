import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { User } from 'src/decorators/current-user';
import { Roles } from 'src/decorators/role-route';
import { RoleEnum } from 'src/constants/role.enum';
import { Response_AddCart_DTO } from './dto/response-cart.dto';
import { ResponseMessage } from 'src/decorators/response_message.decorator';
import { UserValidationType } from 'src/auth/strategy/jwt.strategy';

@ApiTags(Tag.CART)
@ApiBearerAuth()
@Controller('cart')
@Roles(RoleEnum.USER)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Thêm hàng vào giỏ or tạo giỏ hàng
  @ApiOperation({
    summary: 'Thêm hàng vào giỏ hàng',
  })
  @ApiCreatedResponse({
    status: 200,
    type: Response_AddCart_DTO,
  })
  @Post()
  @ResponseMessage('Thêm sản phẩm vào giỏ hàng thành công')
  create(@Body() createCartDto: CreateCartDto, @User() user) {
    return this.cartService.addToCart(createCartDto, user);
  }

  @ApiOperation({
    summary: 'Lấy ra cart và cart_item của khách ',
  })
  @ResponseMessage('Lấy danh sách sản phẩm ở giỏ hàng thành công')
  @Get()
  findAll(@User() user: UserValidationType) {
    return this.cartService.getCart(user);
  }
  @ApiOperation({
    summary: 'Cập nhật cart_item  của khách theo "cart_item_id" ',
  })
  @Patch(':id')
  @ApiParam({
    example: '6c365145-8a25-49ef-b964-5e2168657b30',
    name: 'id',
  })
  @ResponseMessage('Cập nhật sản phẩm ở giỏ hàng thành công')
  update(
    @Param('id') id: string,
    @Body() quantity: UpdateCartDto,
    @User() user: UserValidationType,
  ) {
    return this.cartService.updateCart(user, id, quantity);
  }

  // Xóa từng sản phẩm trong giỏ hàng
  @ApiOperation({
    summary: 'Xóa từng sản phẩm/biến thể trong giỏ hàng theo id sku, xóa 1 sku',
  })
  @Delete(':id')
  @ResponseMessage('Xóa sản phẩm ở giỏ hàng thành công')
  remove(@Param('id') id: string, @User() user: UserValidationType) {
    return this.cartService.remove(user, id);
  }

  //xóa cartItem
  @ApiOperation({
    summary: 'Xóa Detail Cart Item trong giỏ hàng theo id Detail Cart ',
  })
  @Delete('cartItem/:id')
  @ResponseMessage('Xóa sản phẩm ở giỏ hàng thành công')
  removeCartItemByID(
    @Param('id') id: string,
    @User() user: UserValidationType,
  ) {
    return this.cartService.removeCartItem(user, id);
  }
  // Xóa từng sản phẩm trong giỏ hàng
  @ApiOperation({
    summary: 'Xóa giỏ hàng luôn',
  })
  @ResponseMessage('Xóa tất cả sản phẩm ở giỏ hàng thành công')
  @Delete()
  clearCart(@User() user: UserValidationType) {
    return this.cartService.clearCart(user);
  }
}
