import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ErrorResponseBodySchema,
  SuccessResponseBodySchema,
} from 'src/constants/response-body-schema';
import { ResponseOrderDetailDto } from './dto/response-order_detail.dto';
import { Tag } from 'src/constants/api-tag.enum';

@Controller('order-detail')
@ApiBearerAuth()
@ApiTags(Tag.ORDER_DETAIL)
@ApiExtraModels(ResponseOrderDetailDto)
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new order detail',
    description: `Body of order detail \n
          order_id: id of order (UUID, required) \n
          skus_id: id of skus (skus include product or variant information) (UUID, required) \n
          quantity: quantity of product (number, required) \n`,
  })
  @ApiBody({ type: CreateOrderDetailDto })
  @ApiResponse({
    status: 201,
    description: 'Create a new order detail',
    schema: SuccessResponseBodySchema(
      201,
      'Create a new order detail successfully',
      ResponseOrderDetailDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields or invalid data type',
    schema: ErrorResponseBodySchema(
      400,
      `Missing required fields or invalid data type`,
      '/order-detail',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Order or skus not found',
    schema: ErrorResponseBodySchema(
      404,
      `Order or skus not found`,
      '/order-detail',
    ),
  })
  async create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
    return await this.orderDetailService.create(createOrderDetailDto);
  }
}
