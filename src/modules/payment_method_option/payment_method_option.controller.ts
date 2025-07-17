import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PaymentMethodOptionService } from './payment_method_option.service';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { CreatePaymentMethodOptionDto } from './dto/create-payment_method_option.dto';
import {
  ErrorResponseBodySchema,
  SuccessResponseBodySchema,
} from 'src/constants/response-body-schema';
import { Public } from 'src/decorators/public-route';
import { ResponsePaymentMethodDto } from '../payment_method/dto/response-payment_method.dto';

@ApiTags(Tag.PaymentMethodOption)
@Public()
@ApiExtraModels(ResponsePaymentMethodDto)
@Controller('payment-method-option')
export class PaymentMethodOptionController {
  constructor(
    private readonly paymentMethodOptionService: PaymentMethodOptionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new payment method option',
    description: `Body \n
        name: name of the payment method option (string, required) \n
        description: description of the payment method option (string, optional) \n
        payment_method_id: id of the payment method (number, required) \n
    `,
  })
  @ApiBody({
    type: CreatePaymentMethodOptionDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Created a new payment method option',
    schema: SuccessResponseBodySchema(
      201,
      'Created a new payment method option',
      CreatePaymentMethodOptionDto,
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method not found',
    schema: ErrorResponseBodySchema(
      404,
      'Payment method not found',
      '/payment-method-option',
    ),
  })
  async create(@Body() createDto: CreatePaymentMethodOptionDto) {
    return this.paymentMethodOptionService.create(createDto);
  }

  @Get('name/:name')
  @ApiOperation({
    summary: 'Get a payment method option by name',
  })
  @ApiParam({
    name: 'name',
    type: 'string',
    description: 'Name of the payment method option',
    example: 'VNPAY',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method option found',
    schema: SuccessResponseBodySchema(
      200,
      'Payment method option found',
      ResponsePaymentMethodDto,
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method option not found',
    schema: ErrorResponseBodySchema(
      404,
      'Payment method option not found',
      '/payment-method-option/name/:name',
    ),
  })
  async findOneByName(@Param('name') name: string) {
    return this.paymentMethodOptionService.findOneByName(name);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a payment method option by ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    format: 'int',
    description: 'ID of the payment method option',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method option found',
    schema: SuccessResponseBodySchema(
      200,
      'Payment method option found',
      ResponsePaymentMethodDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
    schema: ErrorResponseBodySchema(
      400,
      'Invalid ID format',
      '/payment-method-option',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method option not found',
    schema: ErrorResponseBodySchema(
      404,
      'Payment method option not found',
      '/payment-method-option',
    ),
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodOptionService.findOne(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all payment method options',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method options found',
    schema: SuccessResponseBodySchema(
      200,
      'Payment method options found',
      ResponsePaymentMethodDto,
      true,
    ),
  })
  async findAll() {
    return this.paymentMethodOptionService.findAll();
  }

  @Post(':id')
  @ApiOperation({
    summary: 'Update a payment method option by ID',
    description: `Body \n
        name: name of the payment method option (string, optional) \n
        description: description of the payment method option (string, optional) \n
        payment_method_id: id of the payment method (number, optional) \n
    `,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    format: 'int',
    description: 'ID of the payment method option',
    example: 1,
  })
  @ApiBody({
    type: CreatePaymentMethodOptionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method option updated',
    schema: SuccessResponseBodySchema(
      200,
      'Payment method option updated',
      CreatePaymentMethodOptionDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
    schema: ErrorResponseBodySchema(
      400,
      'Invalid ID format',
      '/payment-method-option',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method option not found',
    schema: ErrorResponseBodySchema(
      404,
      'Payment method option not found',
      '/payment-method-option',
    ),
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: CreatePaymentMethodOptionDto,
  ) {
    return this.paymentMethodOptionService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a payment method option by ID',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    format: 'int',
    description: 'ID of the payment method option',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method option deleted',
    schema: SuccessResponseBodySchema(
      200,
      'Payment method option deleted',
      ResponsePaymentMethodDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
    schema: ErrorResponseBodySchema(
      400,
      'Invalid ID format',
      '/payment-method-option',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method option not found',
    schema: ErrorResponseBodySchema(
      404,
      'Payment method option not found',
      '/payment-method-option',
    ),
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodOptionService.remove(id);
  }
}
