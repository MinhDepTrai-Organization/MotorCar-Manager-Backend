import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DeliveryMethodService } from './delivery_method.service';
import { CreateDeliveryMethodDto } from './dto/create-delivery_method.dto';
import { UpdateDeliveryMethodDto } from './dto/update-delivery_method.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Tag } from 'src/constants/api-tag.enum';
import { Public } from 'src/decorators/public-route';

@Controller('delivery-method')
@ApiTags(Tag.DELIVERY_METHOD)
@Public()
export class DeliveryMethodController {
  constructor(private readonly deliveryMethodService: DeliveryMethodService) {}

  @Post()
  @ApiOperation({
    summary: 'Create new deliver method',
    description: `Body data \n
          name: name of the deliver method (string, required) \n
          fee: fee of the deliver method (number, required) \n
          description: description of the deliver method (string, optional) \n
          logo: logo url of the deliver method (url string, optional) \n
    `,
  })
  @ApiBody({ type: CreateDeliveryMethodDto })
  @ApiResponse({
    status: 201,
    description: 'Create deliver method success',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Create deliver method success',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f7f3b1d1-5b1b-4d8c-9b8b-3d7c6e7d7c6e',
            },
            name: {
              type: 'string',
              example: 'Giao hàng tiết kiệm',
            },
            description: {
              type: 'string',
              example: 'Giao hàng tiết kiệm là dịch vụ giao hàng nhanh chóng',
            },
            fee: {
              type: 'number',
              example: 100000,
            },
            logo: {
              type: 'string',
              example: 'https://giao-hang-tiet-kiem.vn/logo.png',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields or invalid data',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          example: 'Missing required fields or invalid data',
        },
      },
    },
  })
  create(@Body() createDeliveryMethodDto: CreateDeliveryMethodDto) {
    return this.deliveryMethodService.create(createDeliveryMethodDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update deliver method',
    description: `Body data \n
          name: name of the deliver method (string, optional) \n
          fee: fee of the deliver method (number, optional) \n
          description: description of the deliver method (string, optional) \n
          logo: logo url of the deliver method (url string, optional) \n
    `,
  })
  @ApiBody({ type: UpdateDeliveryMethodDto })
  @ApiParam({
    name: 'id',
    description: 'Delivery method UUID string',
  })
  @ApiResponse({
    status: 200,
    description: 'Update deliver method success',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Update deliver method success',
        },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'f7f3b1d1-5b1b-4d8c-9b8b-3d7c6e7d7c6e',
            },
            name: {
              type: 'string',
              example: 'Giao hàng tiết kiệm',
            },
            description: {
              type: 'string',
              example: 'Giao hàng tiết kiệm là dịch vụ giao hàng nhanh chóng',
            },
            fee: {
              type: 'number',
              example: 100000,
            },
            logo: {
              type: 'string',
              example: 'https://giao-hang-tiet-kiem.vn/logo.png',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Missing required fields or invalid data',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'string',
          example: 'Missing required fields or invalid data',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery method not found',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Delivery method not found',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Name already exists',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 409,
        },
        message: {
          type: 'string',
          example: 'Name already exists',
        },
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeliveryMethodDto: UpdateDeliveryMethodDto,
  ) {
    return this.deliveryMethodService.update(id, updateDeliveryMethodDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all deliver methods',
    description: 'Get all deliver methods',
  })
  findAll() {
    return this.deliveryMethodService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get deliver method by id',
    description: 'Get deliver method by id',
  })
  @ApiParam({
    name: 'id',
    description: 'Delivery method UUID string',
  })
  @ApiResponse({
    status: 200,
    description: 'Get deliver method success',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'f7f3b1d1-5b1b-4d8c-9b8b-3d7c6e7d7c6e',
        },
        name: {
          type: 'string',
          example: 'Giao hàng tiết kiệm',
        },
        description: {
          type: 'string',
          example: 'Giao hàng tiết kiệm là dịch vụ giao hàng nhanh chóng',
        },
        fee: {
          type: 'number',
          example: 100000,
        },
        logo: {
          type: 'string',
          example: 'https://giao-hang-tiet-kiem.vn/logo.png',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery method not found',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Delivery method not found',
        },
      },
    },
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliveryMethodService.findOneBy('id', id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete deliver method by id',
    description: 'Delete deliver method by id',
  })
  @ApiParam({
    name: 'id',
    description: 'Delivery method UUID string',
  })
  @ApiResponse({
    status: 200,
    description: 'Delete deliver method success',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 200,
        },
        message: {
          type: 'string',
          example: 'Delete deliver method success',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Delivery method not found',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
          example: 404,
        },
        message: {
          type: 'string',
          example: 'Delivery method not found',
        },
      },
    },
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deliveryMethodService.remove(id);
  }
}
