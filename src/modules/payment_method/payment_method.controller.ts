import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaymentMethodService } from './payment_method.service';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment_method.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public-route';
import { Tag } from 'src/constants/api-tag.enum';
import { ResponsePaymentMethodDto } from './dto/response-payment_method.dto';
import {
  SuccessResponseBodySchema,
  ErrorResponseBodySchema,
} from 'src/constants/response-body-schema';

@ApiBearerAuth()
@ApiExtraModels(ResponsePaymentMethodDto)
@ApiTags(Tag.PAYMENT_METHOD)
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new payment method',
    description: `Body data \n
          name: name of the payment method (string, required) \n
          description: description of the payment method (string, optional) \n
          logo: logo url of the payment method (url string, optional) \n
    `,
  })
  @ApiBody({
    type: CreatePaymentMethodDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Create payment method success',
    schema: SuccessResponseBodySchema(
      201,
      'Create payment method success',
      ResponsePaymentMethodDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, missing required field or invalid value',
    schema: {
      oneOf: [
        {
          ...ErrorResponseBodySchema(
            400,
            'Name is required',
            '/payment-method',
          ),
        },
        {
          ...ErrorResponseBodySchema(
            400,
            'logo must be a valid URL',
            '/payment-method',
          ),
        },
      ],
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Payment method name already exists',
    schema: ErrorResponseBodySchema(
      409,
      'Payment method name already exists',
      '/payment-method',
    ),
  })
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.paymentMethodService.create(createPaymentMethodDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: "Update payment method's information",
    description: `Body data \n
          name: name of the payment method (string, optional) \n
          description: description of the payment method (string, optional) \n
          logo: logo url of the payment method (url string, optional)
    `,
  })
  @ApiBody({
    type: UpdatePaymentMethodDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Payment method UUID string',
  })
  @ApiResponse({
    status: 200,
    description: 'Update payment method success',
    schema: SuccessResponseBodySchema(
      200,
      'Update payment method success',
      ResponsePaymentMethodDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request, missing required field or invalid value',
    schema: {
      oneOf: [
        {
          ...ErrorResponseBodySchema(
            400,
            'Name is required',
            '/payment-method/:id',
          ),
        },
        {
          ...ErrorResponseBodySchema(
            400,
            'logo must be a valid URL',
            '/payment-method/:id',
          ),
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not found any payment method with the given ID',
    schema: ErrorResponseBodySchema(
      404,
      'Not found any payment method with the given ID',
      '/payment-method/:id',
    ),
  })
  @ApiResponse({
    status: 409,
    description: 'Payment method name already exists',
    schema: ErrorResponseBodySchema(
      400,
      'Payment method name already exists',
      '/payment-method/:id',
    ),
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePaymentMethodDto,
  ) {
    return await this.paymentMethodService.update(id, updateDto);
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all payment methods',
  })
  @ApiResponse({
    status: 200,
    description: 'Get all payment methods success',
    schema: SuccessResponseBodySchema(
      200,
      'Get all payment methods success',
      ResponsePaymentMethodDto,
      true,
    ),
  })
  async getAllPaymentMethods() {
    return await this.paymentMethodService.findAll();
  }

  @Get('payment-method-name')
  @Public()
  @ApiOperation({
    summary: 'Get all payment method names',
  })
  @ApiResponse({
    status: 200,
    description: 'Get all payment method names success',
    schema: SuccessResponseBodySchema(
      200,
      'Get all payment method names success',
      ['VNPAY', 'ZALOPAY'],
    ),
  })
  async getAllPaymentMethodNames() {
    return await this.paymentMethodService.findAllPaymentMethodNames();
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get payment method by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment method UUID string',
  })
  @ApiResponse({
    status: 200,
    description: 'Get payment method by ID success',
    schema: SuccessResponseBodySchema(
      200,
      'Get payment method by ID success',
      ResponsePaymentMethodDto,
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Not found any payment method with the given ID',
    schema: ErrorResponseBodySchema(
      404,
      'Not found any payment method with the given ID',
      '/payment-method/:id',
    ),
  })
  async getPaymentMethodById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.paymentMethodService.findOneBy('id', id);
  }
}
