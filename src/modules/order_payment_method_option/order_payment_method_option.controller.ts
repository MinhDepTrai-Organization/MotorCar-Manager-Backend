import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderPaymentMethodOptionService } from './order_payment_method_option.service';
import { CreateOrderPaymentMethodOptionDto } from './dto/create-order_payment_method_option.dto';
import { UpdateOrderPaymentMethodOptionDto } from './dto/update-order_payment_method_option.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ErrorResponseBodySchema,
  SuccessResponseBodySchema,
} from 'src/constants/response-body-schema';
import { ResponseOrderPaymentMethodOption } from './dto/response-order-payment_method_option.dto';
import { Tag } from 'src/constants/api-tag.enum';

@Controller('order-payment-method-option')
@ApiTags(Tag.ORDER_PAYMENT_METHOD_OPTION)
@ApiBearerAuth()
@ApiExtraModels(ResponseOrderPaymentMethodOption)
export class OrderPaymentMethodOptionController {
  constructor(
    private readonly orderPaymentMethodOptionService: OrderPaymentMethodOptionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new payment method option of order',
    description: `Body \n
    {
      "order_id": "id of the order" (uuid, required),
      "payment_method_option_id": 1 (id of the payment method option) (int, required),
      "value": "value of the payment method option" (string, required)
    }
    `,
  })
  @ApiBody({ type: CreateOrderPaymentMethodOptionDto })
  @ApiResponse({
    status: 201,
    description:
      'The order payment method option has been successfully created.',
    schema: SuccessResponseBodySchema(
      201,
      'Order payment method option created successfully',
      ResponseOrderPaymentMethodOption,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    schema: ErrorResponseBodySchema(
      400,
      'Missing required fields or invalid input data',
      '/order-payment-method-option',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found.',
    schema: ErrorResponseBodySchema(
      404,
      'Not found order or payment method option',
      '/order-payment-method-option',
    ),
  })
  async create(
    @Body()
    createOrderPaymentMethodOptionDto: CreateOrderPaymentMethodOptionDto,
  ) {
    return await this.orderPaymentMethodOptionService.create(
      createOrderPaymentMethodOptionDto,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a payment method option of order',
    description: `Body \n
    {
      "order_id": "id of the order" (uuid, required),
      "payment_method_option_id": 1 (id of the payment method option) (int, required),
      "value": "value of the payment method option" (string, optional)
    }
    `,
  })
  @ApiBody({ type: UpdateOrderPaymentMethodOptionDto })
  @ApiResponse({
    status: 200,
    description:
      'The order payment method option has been successfully updated.',
    schema: SuccessResponseBodySchema(
      200,
      'Order payment method option updated successfully',
      ResponseOrderPaymentMethodOption,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    schema: ErrorResponseBodySchema(
      400,
      'Missing required fields or invalid input data',
      '/order-payment-method-option',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found.',
    schema: ErrorResponseBodySchema(
      404,
      'Not found order or payment method option or order payment method option',
      '/order-payment-method-option',
    ),
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    format: 'int',
    description: 'id of the order payment method option',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderPaymentMethodOptionDto,
  ) {
    return await this.orderPaymentMethodOptionService.update(id, dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a payment method option of order',
  })
  @ApiResponse({
    status: 200,
    description: 'The order payment method option has been successfully found.',
    schema: SuccessResponseBodySchema(
      200,
      'Order payment method option found',
      ResponseOrderPaymentMethodOption,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    schema: ErrorResponseBodySchema(
      400,
      'Missing required fields or invalid input data',
      '/order-payment-method-option',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found.',
    schema: ErrorResponseBodySchema(
      404,
      'Not found order payment method option',
      '/order-payment-method-option',
    ),
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    format: 'int',
    description: 'id of the order payment method option',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.orderPaymentMethodOptionService.findOne(id);
  }

  @Get('order/:orderId/payment-method-option/:paymentMethodOptionId')
  @ApiOperation({
    summary:
      'Get a payment method option of order by orderId and paymentMethodOptionId',
    description: `Using this to get a payment method option of order to find or change value of it \n
      Params \n
      orderId: "id of the order" (uuid, required),
      paymentMethodOptionId: 1 (id of the payment method option) (int, required)
    `,
  })
  @ApiParam({
    name: 'orderId',
    type: String,
    format: 'uuid',
    description: 'id of the order',
  })
  @ApiParam({
    name: 'paymentMethodOptionId',
    type: Number,
    format: 'int',
    description: 'id of the payment method option',
  })
  @ApiResponse({
    status: 200,
    description: 'The order payment method option has been successfully found.',
    schema: SuccessResponseBodySchema(
      200,
      'Order payment method option found',
      ResponseOrderPaymentMethodOption,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request.',
    schema: ErrorResponseBodySchema(
      400,
      'Missing required fields or invalid input data',
      '/order-payment-method-option',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found.',
    schema: ErrorResponseBodySchema(
      404,
      'Not found order payment method option',
      '/order-payment-method-option/order/:orderId/payment-method-option/:paymentMethodOptionId',
    ),
  })
  async findOneByOrderIdAndPaymentMethodOptionId(
    @Param('orderId') orderId: string,
    @Param('paymentMethodOptionId') paymentMethodOptionId: number,
  ) {
    return await this.orderPaymentMethodOptionService.findOneByOrderIdAndPaymentMethodOptionId(
      orderId,
      paymentMethodOptionId,
    );
  }
}
