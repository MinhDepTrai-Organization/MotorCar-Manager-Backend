import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ReceiveAddressService } from './receive_address.service';
import { CreateReceiveAddressDto } from './dto/create-receive_address.dto';
import { UpdateReceiveAddressDto } from './dto/update-receive_address.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import {
  ErrorResponseBodySchema,
  SuccessResponseBodySchema,
} from 'src/constants/response-body-schema';
import { ResponseReceiveAddressDto } from './dto/response-receive_address.dto';

@Controller('receive-address')
@ApiExtraModels(ResponseReceiveAddressDto)
@ApiTags(Tag.RECEIVE_ADDRESS)
@ApiBearerAuth()
export class ReceiveAddressController {
  constructor(private readonly receiveAddressService: ReceiveAddressService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new receive address for customer',
    description: `Body of the createReceiveAddress \n
          customerId: UUID string, Id of the customer (required) \n
          receiver_name: string, Name of the receiver (required) \n
          receiver_phone: string, Phone number of the receiver (required) \n
          street: string, Name of the street (required) \n
          ward: string, Name of the ward (required) \n
          district: string, Name of the district (required) \n
          province: string, Name of the province (required) \n
          postal_code: string, Postal code (optional) \n
          note: string, Note for the address (optional)
    `,
  })
  @ApiBody({
    type: CreateReceiveAddressDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Create receive address success',
    schema: SuccessResponseBodySchema(
      201,
      'Create receive address success',
      ResponseReceiveAddressDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields Or Invalid data',
    schema: ErrorResponseBodySchema(
      400,
      'Missing required fields or Invalid data',
      '/receive-address',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
    schema: ErrorResponseBodySchema(
      404,
      'Customer not found',
      '/receive-address',
    ),
  })
  @ApiResponse({
    status: 409,
    description: 'Customer already has a default receive address',
    schema: ErrorResponseBodySchema(
      409,
      'Customer already has this receive address or Customer only has maximum 3 receive address',
      '/receive-address',
    ),
  })
  async create(@Body() createReceiveAddressDto: CreateReceiveAddressDto) {
    return await this.receiveAddressService.create(createReceiveAddressDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update receive address for customer',
    description: `Body of the createReceiveAddress \n
          customerId: UUID string, Id of the customer (optional) \n
          receiver_name: string, Name of the receiver (optional) \n
          receiver_phone: string, Phone number of the receiver (optional) \n
          street: string, Name of the street (optional) \n
          ward: string, Name of the ward (optional) \n
          district: string, Name of the district (optional) \n
          province: string, Name of the province (optional) \n
          postal_code: string, Postal code (optional) \n
          note: string, Note for the address (optional)
    `,
  })
  @ApiBody({
    type: UpdateReceiveAddressDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ReceiveAddress UUID string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Update receive address success',
    schema: SuccessResponseBodySchema(
      200,
      'Update receive address success',
      ResponseReceiveAddressDto,
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields Or Invalid data',
    schema: ErrorResponseBodySchema(
      400,
      'Missing required fields or Invalid data',
      '/receive-address/:id',
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Receive address not found',
    schema: ErrorResponseBodySchema(
      404,
      'Receive address not found',
      '/receive-address/:id',
    ),
  })
  @ApiResponse({
    status: 409,
    description: 'Customer already has a default receive address',
    schema: ErrorResponseBodySchema(
      409,
      'Customer already has this receive address or Customer only has maximum 3 receive address',
      '/receive-address/:id',
    ),
  })
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => {
          throw new BadRequestException(
            'Receive address ID must be UUID string',
          );
        },
      }),
    )
    id: string,
    @Body() updateReceiveAddressDto: UpdateReceiveAddressDto,
  ) {
    return await this.receiveAddressService.update(id, updateReceiveAddressDto);
  }

  @Patch(':id/default')
  @ApiOperation({
    summary: 'Set default receive address for customer',
  })
  @ApiParam({
    name: 'id',
    description: 'Receive Address UUID string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Set default receive address success',
    schema: SuccessResponseBodySchema(
      200,
      'Set default receive address success',
      ResponseReceiveAddressDto,
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Receive address not found',
    schema: ErrorResponseBodySchema(
      404,
      'Receive address not found',
      '/receive-address/:id/default',
    ),
  })
  @ApiResponse({
    status: 409,
    description: 'Customer already has this receive address as default',
    schema: ErrorResponseBodySchema(
      409,
      'Customer already has this receive address as default',
      '/receive-address/:id/default',
    ),
  })
  async setDefaultReceiveAddress(@Param('id', ParseUUIDPipe) id: string) {
    return await this.receiveAddressService.setDefaultReceiveAddress(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all receive address',
  })
  @ApiResponse({
    status: 200,
    description: 'Get all receive address success',
    schema: SuccessResponseBodySchema(
      200,
      'Get all receive address success',
      ResponseReceiveAddressDto,
      true,
    ),
  })
  async findAll() {
    return await this.receiveAddressService.findAll();
  }

  @Get('customer/:customerId')
  @ApiOperation({
    summary: 'Get receive address by customer ID',
    description: 'Get all customer receive address',
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer UUID string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Get receive address by customer ID success',
    schema: SuccessResponseBodySchema(
      200,
      'Get receive address by customer ID success',
      ResponseReceiveAddressDto,
      true,
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
    schema: ErrorResponseBodySchema(
      404,
      'Customer not found',
      '/receive-address/customer/:customerId',
    ),
  })
  async getReceiveAddressByCustomerID(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ) {
    return await this.receiveAddressService.getAllByCustomerId(customerId);
  }

  @Get('customer/:customerId/default')
  @ApiOperation({
    summary: 'Get default receive address by customer ID',
    description: 'Get default receive address of the customer',
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer UUID string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Get default receive address by customer ID success',
    schema: SuccessResponseBodySchema(
      200,
      'Get default receive address by customer ID success',
      ResponseReceiveAddressDto,
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
    schema: ErrorResponseBodySchema(
      404,
      'Customer not found',
      '/receive-address/customer/:customerId/default',
    ),
  })
  async getDefaultReceiveAddressByCustomerID(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ) {
    return await this.receiveAddressService.getDefaultReceiveAddressByCustomerId(
      customerId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get receive address by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Receive Address UUID string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Get receive address by ID success',
    schema: SuccessResponseBodySchema(
      200,
      'Get receive address by ID success',
      ResponseReceiveAddressDto,
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Receive address not found',
    schema: ErrorResponseBodySchema(
      404,
      'Receive address not found',
      '/receive-address/:id',
    ),
  })
  async getReceiveAddressByID(@Param('id', ParseUUIDPipe) id: string) {
    return await this.receiveAddressService.findOneBy('id', id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete receive address by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Receive Address UUID string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete receive address by ID success',
    schema: SuccessResponseBodySchema(
      200,
      'Delete receive address success',
      ResponseReceiveAddressDto,
    ),
  })
  @ApiResponse({
    status: 404,
    description: 'Receive address not found',
    schema: ErrorResponseBodySchema(
      404,
      'Receive address not found',
      '/receive-address/:id',
    ),
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.receiveAddressService.remove(id);
  }
}
