import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  Put,
} from '@nestjs/common';
import { getMonthsInRange, OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
  PickType,
} from '@nestjs/swagger';
import {
  ErrorResponseBodySchema,
  SuccessResponseBodySchema,
} from 'src/constants/response-body-schema';
import { ResponseOrderDto } from './dto/response-order.dto';
import { Tag } from 'src/constants/api-tag.enum';
import { SortOrder } from 'src/constants/sortOrder.enum';
import {
  OrderPaginationQueryDto,
  orderSortBy,
} from './dto/order-pagination-query.dto';
import { CancelOrderDto } from './dto/update-order-status.dto';
import { order_status } from 'src/constants/order_status.enum';
import { User } from 'src/decorators/current-user';
import { CreateOrderDtoFromCart } from './dto/create-order-from-cart.dto';
import RevenueProfitStaticsDto, {
  EnumTypeOfTimeStatistics,
} from './dto/revenue-profit-statics.dto';
import dayjs from 'dayjs';
import { UserValidationType } from 'src/auth/passport/jwt.strategy';

@Controller('order')
@ApiBearerAuth()
@ApiTags(Tag.ORDER)
@ApiExtraModels(ResponseOrderDto)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new order',
    description: `Body of order \n
          customer_id: id of customer (UUID, required) \n
          receive_address_id: id of receive address (UUID, required) \n
          total_price: total price of the order (number, required) \n
          discount_price: discount price of the order (number, required) \n
          order_note: note of the order (string, optional) \n
          payment_method_id: id of payment method (UUID, required) \n
          delivery_method_id: id of delivery method (UUID, required) \n
          order_details: list of order details (array of object, required) \n
    `,
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    schema: SuccessResponseBodySchema(
      201,
      'Order has been successfully created',
      ResponseOrderDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields or invalid input data',
    schema: {
      oneOf: [
        ErrorResponseBodySchema(
          400,
          'Missing required fields, invalid input data such as total_price or discount_price must be a positive number, duplicate skus_id in order_details',
          '/order',
        ),
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description:
      'Customer, receive address, payment method or delivery method not found',
    schema: ErrorResponseBodySchema(
      404,
      'Customer, receive address, payment method or delivery method not found',
      '/order',
    ),
  })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

  @Post('/create-from-cartItem')
  @ApiOperation({
    summary: 'Create a new order from cart item',
    description: `Body of order \n
          customer_id: id of customer (UUID, required) \n
          receive_address_id: id of receive address (UUID, required) \n
          total_price: total price of the order (number, required) \n
          discount_price: discount price of the order (number, required) \n
          order_note: note of the order (string, optional) \n
          payment_method_id: id of payment method (UUID, required) \n
          delivery_method_id: id of delivery method (UUID, required) \n
          cart_item_ids: list of cart item ids (array of string, required) \n
    `,
  })
  @ApiBody({ type: CreateOrderDtoFromCart })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    schema: SuccessResponseBodySchema(
      201,
      'Order has been successfully created',
      ResponseOrderDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields or invalid input data',
    schema: {
      oneOf: [
        ErrorResponseBodySchema(
          400,
          'Missing required fields, invalid input data such as total_price or discount_price must be a positive number, duplicate skus_id in order_details',
          '/order',
        ),
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description:
      'Customer, receive address, payment method or delivery method not found',
    schema: ErrorResponseBodySchema(
      404,
      'Customer, receive address, payment method or delivery method not found',
      '/order',
    ),
  })
  @ApiResponse({
    status: 409,
    description: 'Cart item not found',
    schema: ErrorResponseBodySchema(
      409,
      'Cart item not found',
      '/order/create-from-cartItem',
    ),
  })
  async createOrderFromCart(@Body() createOrderDto: CreateOrderDtoFromCart) {
    return await this.orderService.createOrderFromCartItem(createOrderDto);
  }

  @Get('/order-status')
  @ApiOperation({
    summary: 'Get all order status',
  })
  @ApiResponse({
    status: 200,
    description: 'Get all order status success',
    schema: SuccessResponseBodySchema(
      200,
      'Order status has been successfully retrieved',
      Object.values(order_status)
        .filter((o) => isNaN(Number(o)))
        .map((key) => ({
          key,
          value: order_status[key],
        })),
    ),
  })
  getAllOrderStatus() {
    return this.orderService.getAllOrderStatus();
  }

  @Get('/payment-status')
  @ApiOperation({
    summary: 'Get all payment status',
  })
  @ApiResponse({
    status: 200,
    description: 'Get all payment status success',
    schema: SuccessResponseBodySchema(
      200,
      'Payment status has been successfully retrieved',
      Object.values(order_status)
        .filter((o) => isNaN(Number(o)))
        .map((key) => ({
          key,
          value: order_status[key],
        })),
    ),
  })
  getAllPaymentStatus() {
    return this.orderService.getAllPaymentStatus();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Get order by ID success',
    schema: SuccessResponseBodySchema(
      200,
      'Order has been successfully retrieved',
      ResponseOrderDto,
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found any order with the given ID',
    schema: ErrorResponseBodySchema(
      404,
      'Not found any order with the given ID',
      '/order/:id',
    ),
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: 'string',
    format: 'UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async findOneOrder(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderService.findOne(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all orders by filters',
    description: `filters params: \n
      search: search by order id, customer id, customer username or customer email (string, optional) \n
      customer_id: id of customer (UUID, optional) \n
      order_status: status of the order (string, optional) \n
      payment_status: status of payment (string, optional) \n
      payment_method: name of payment method (string, optional) \n
      created_from: filter orders created from a specific date (string, optional) \n
      created_to: filter orders created to a specific date (string, optional) \n
      current: current page (number, optional, default is 1) \n
      pageSize: number of items per page (number, optional, default is 1000) \n
      sortOrder: sort order (ASC or DESC, optional, default is DESC) \n
      sortBy: sort by field (createdAt or updatedAt, optional, default is updatedAt) \n
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Get all orders success',
    schema: SuccessResponseBodySchema(
      200,
      'Orders has been successfully retrieved',
      {
        type: 'object',
        properties: {
          total: { type: 'number', example: 1 },
          current: { type: 'number', example: 1 },
          pageSize: { type: 'number', example: 5 },
          sortOrder: { type: 'string', example: 'DESC' },
          sortBy: { type: 'string', example: 'updatedAt' },
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(ResponseOrderDto) },
          },
        },
      },
      true,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query params',
    schema: ErrorResponseBodySchema(400, 'Invalid query params', '/order'),
  })
  async findAllOrder(@Query() query: OrderPaginationQueryDto) {
    return await this.orderService.findAll(query);
  }

  @Get(':id/customer')
  @ApiOperation({
    summary: 'Get order by customer ID',
    description: `Get order by customer ID \n
          current: current page (number, optional, default is 1) \n
          pageSize: number of items per page (number, optional, default is 1000) \n
          sortOrder: sort order (ASC or DESC, optional, default is DESC) \n
          sortBy: sort by field (createdAt or updatedAt, optional, default is updatedAt) \n`,
  })
  @ApiParam({
    name: 'id',
    description: 'The customer ID',
    type: 'string',
    format: 'UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'current',
    description: 'The current page',
    type: 'number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'The number of items per page',
    type: 'number',
    required: false,
    example: 5,
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Sort order',
    required: false,
    enum: SortOrder,
    example: SortOrder.DESC,
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Sort by field',
    required: false,
    enum: orderSortBy,
    example: orderSortBy.UPDATED_AT,
  })
  @ApiResponse({
    status: 200,
    description: 'Get order by customer ID success',
    schema: SuccessResponseBodySchema(
      200,
      'Order has been successfully retrieved',
      ResponseOrderDto,
      true,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query params',
    schema: ErrorResponseBodySchema(
      400,
      'Invalid query params',
      '/order/:id/customer',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found any order with the given customer ID',
    schema: ErrorResponseBodySchema(
      404,
      'Not found any order with the given customer ID',
      '/order/:id/customer',
    ),
  })
  async getOrderByCustomerId(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationQueryDto: OrderPaginationQueryDto,
  ) {
    return await this.orderService.getOrderByCustomerId(id, paginationQueryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete order by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: 'string',
    format: 'UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully deleted.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        message: {
          type: 'string',
          example: 'Order has been successfully deleted',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found any order with the given ID',
    schema: ErrorResponseBodySchema(
      404,
      'Not found any order with the given ID',
      '/order/:id',
    ),
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.orderService.remove(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update order by ID',
    description: `Update order information, except order status\n
    Body of order: \n
    customer_id: id of customer (UUID, optional) \n
    receive_address_id: id of receive address (UUID, optional) \n
    total_price: total price of the order (number, optional) \n
    discount_price: discount price of the order (number, optional) \n
    order_note: note of the order (string, optional) \n
    payment_method_id: id of payment method (UUID, optional) \n
    delivery_method_id: id of delivery method (UUID, optional) \n
    order_details: list of order details (array of object, optional) \n`,
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: 'string',
    format: 'UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
    schema: SuccessResponseBodySchema(
      200,
      'Order has been successfully updated',
      ResponseOrderDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields or invalid input data',
    schema: {
      oneOf: [
        ErrorResponseBodySchema(400, 'Missing required fields', '/order/:id'),
        ErrorResponseBodySchema(
          400,
          'total_price must be a number',
          '/order/:id',
        ),
        ErrorResponseBodySchema(
          400,
          'total_price must not be less than 0.01',
          '/order/:id',
        ),
        ErrorResponseBodySchema(
          400,
          'discount_price must be a number',
          '/order/:id',
        ),
        ErrorResponseBodySchema(
          400,
          'discount_price must not be less than 0.01',
          '/order/:id',
        ),
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description:
      'Order, Customer, receive address, payment method or delivery method not found',
    schema: ErrorResponseBodySchema(
      404,
      'Order, Customer, receive address, payment method or delivery method not found',
      '/order/:id',
    ),
  })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderDto,
  ) {
    return await this.orderService.update(id, updateDto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Update order status by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: 'string',
    format: 'UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The order status has been successfully updated.',
    schema: SuccessResponseBodySchema(
      200,
      'Order status has been successfully updated',
      ResponseOrderDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields or invalid input data',
    schema: {
      oneOf: [
        ErrorResponseBodySchema(
          400,
          'Missing required fields',
          '/order/:id/status',
        ),
        ErrorResponseBodySchema(
          400,
          'order_status must be a string',
          '/order/:id/status',
        ),
        ErrorResponseBodySchema(
          400,
          'order_status must be one of PENDING, CONFIRMED, DELIVERING, DELIVERED, CANCELED',
          '/order/:id/status',
        ),
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found any order with the given ID',
    schema: ErrorResponseBodySchema(
      404,
      'Not found any order with the given ID',
      '/order/:id/status',
    ),
  })
  async updateOrderStatus(
    @User() user: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.orderService.updateNormalOrderStatus(user, id);
  }

  // @Patch('confirm')
  // @ApiOperation({
  //   summary: 'Confirm order and create export order',
  // })
  // @ApiBody({
  //   type: CreateExportOrderDto,
  // })
  // async confirmOrder(
  //   @User() user: any,
  //   @Body() createExport: CreateExportOrderDto,
  // ) {
  //   return await this.orderService.confirmOrder(createExport, user);
  // }

  @Patch(':id/confirm')
  @ApiOperation({
    summary: 'Confirm order by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: String,
    format: 'UUID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async confirmOrder(
    @User() user: UserValidationType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.orderService.confirmOrder(user, id);
  }

  @Patch(':id/export')
  @ApiOperation({
    summary: 'Export order by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: String,
    format: 'UUID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async exportOrder(
    @User() user: UserValidationType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.orderService.exportOrder(user, id);
  }
  @Patch(':id/hand-over')
  @ApiOperation({
    summary: 'Hand over order by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: String,
    format: 'UUID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async handOverOrder(
    @User() user: UserValidationType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.orderService.handOverOrder(user, id);
  }

  @Patch(':id/deliver')
  @ApiOperation({
    summary: 'Deliver order by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: String,
    format: 'UUID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async deliverOrder(
    @User() user: UserValidationType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.orderService.deliverOrder(user, id);
  }

  @Patch(':id/ship')
  @ApiOperation({
    summary: 'ship order by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: String,
    format: 'UUID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async shipOrder(
    @User() user: UserValidationType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.orderService.shipOrder(user, id);
  }

  @Patch(':id/ship-success')
  @ApiOperation({
    summary: 'ship order success by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: String,
    format: 'UUID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async shipOrderSuccess(
    @User() user: UserValidationType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.orderService.shipOrderSuccess(user, id);
  }

  @Patch(':id/cancel')
  @ApiOperation({
    summary: 'Cancel order by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: String,
    format: 'UUID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully canceled.',
    schema: SuccessResponseBodySchema(
      200,
      'Order has been successfully canceled',
      ResponseOrderDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid order id format',
    schema: ErrorResponseBodySchema(
      400,
      'Invalid order id format',
      '/order/:id/cancel',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found any order with the given ID',
    schema: ErrorResponseBodySchema(
      404,
      'Not found any order with the given ID',
      '/order/:id/cancel',
    ),
  })
  @ApiBody({
    description: 'Reason for canceling the order',
    type: CancelOrderDto,
    required: false,
  })
  async cancelOrder(
    @User() user: UserValidationType,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() reason: CancelOrderDto,
  ) {
    return await this.orderService.cancelOrder(id, user, reason?.reason);
  }

  @Patch(':id/failed-delivery')
  @ApiOperation({
    summary: 'Update order status to FAILED_DELIVERY by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'The order ID',
    type: String,
    format: 'UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Update order status to FAILED_DELIVERY success',
    schema: SuccessResponseBodySchema(
      200,
      'Update order status to FAILED_DELIVERY success',
      ResponseOrderDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields or invalid input data',
    schema: ErrorResponseBodySchema(
      400,
      'Missing required fields or invalid input data',
      '/order/:id/failed-delivery',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found any order with the given ID',
    schema: ErrorResponseBodySchema(
      404,
      'Not found any order with the given ID',
      '/order/:id/special-status',
    ),
  })
  @ApiBody({ type: CancelOrderDto })
  async updateSpecialOrderStatus(
    @User() user: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CancelOrderDto,
  ) {
    const { reason } = body;
    return await this.orderService.failedDeliveryOrder(user, id, reason);
  }

  @Post('revenue-profit-statics')
  @ApiOperation({
    summary:
      'Thống kế doanh thu và lợi nhuận theo khoảng tháng trong năm, hoặc theo ngày trong tháng',
  })
  @ApiBody({
    type: RevenueProfitStaticsDto,
    description: `Body of revenue-profit-statics \n
          time_type: type of time statistics (month or day, required) \n
          year: year to get statistics (number, required) \n
          startMonth: start month of the statistics (number, optional, default is 1) \n
          endMonth: end month of the statistics (number, optional, default is 12) \n
          month: month to get statistics (number, optional, default is current month) \n
          startDay: start day of the statistics (number, optional, default is 1) \n
          endDay: end day of the statistics (number, optional, default is last day of the month) \n`,
    required: true,
  })
  async getRevenueProfitStatics(@Body() dto: RevenueProfitStaticsDto) {
    const { time_type, year, startMonth, endMonth, month, startDay, endDay } =
      dto;
    if (time_type === EnumTypeOfTimeStatistics.MONTH) {
      const startDate = new Date(year, startMonth - 1, 1);
      const endDate = new Date(year, endMonth, 0);
      const startDateStr = dayjs(startDate).format('YYYY-MM-DD');
      const endDateStr = dayjs(endDate).format('YYYY-MM-DD');
      const months = getMonthsInRange(startDateStr, endDateStr);
      return await this.orderService.getMonthlyStatistics(months);
    } else {
      const startDate = new Date(year, month - 1, startDay);
      const endDate = new Date(year, month - 1, endDay);
      return await this.orderService.getDailyStatistics(startDate, endDate);
    }
  }

  @Post('total-revenue-profit-statics')
  @ApiOperation({
    summary: 'Thống kê tổng doanh thu và lợi nhuận trong năm',
  })
  @ApiBody({
    type: PickType(RevenueProfitStaticsDto, ['year']),
    description: `Body of total-revenue-profit-statics \n
          year: year to get statistics (number, required) \n`,
    required: true,
  })
  async getTotalRevenueProfitStatics(
    @Body() dto: Pick<RevenueProfitStaticsDto, 'year'>,
  ) {
    const { year } = dto;
    return await this.orderService.getTotalRevenueByYear(year);
  }

  @Post('order-status-statics')
  @ApiOperation({
    summary: 'Thống kê trạng thái đơn hàng theo năm',
  })
  @ApiBody({
    type: PickType(RevenueProfitStaticsDto, ['year']),
    description: `Body of order-status-statics \n
          year: year to get statistics (number, required) \n`,
    required: true,
  })
  async getOrderStatusStaticsByYear(
    @Body() dto: Pick<RevenueProfitStaticsDto, 'year'>,
  ) {
    const { year } = dto;
    return await this.orderService.getOrderStatusByYear(year);
  }
}
