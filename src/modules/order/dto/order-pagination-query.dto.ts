import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  order_status,
  payment_method_name,
  payment_status,
} from 'src/constants/order_status.enum';
import { PaginationQueryDto } from 'src/modules/Base/dto/BasePaginationQuery.dto';

export enum orderSortBy {
  UPDATED_AT = 'updatedAt',
  CREATED_AT = 'createdAt',
}

// Lọc chỉ lấy các key mà giá trị của chúng là số (tức là các key dạng chuỗi)
export const order_status_keys = Object.keys(order_status).filter(
  (key) => typeof order_status[key] === 'number',
) as (keyof typeof order_status)[];
export const payment_status_keys = Object.keys(payment_status).filter(
  (key) => typeof payment_status[key] === 'number',
) as (keyof typeof payment_status)[];

export class OrderPaginationQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by order ID, customer name, or customer email',
  })
  search?: string;

  @ApiProperty({
    name: 'sortBy',
    required: false,
    enum: orderSortBy,
    default: orderSortBy.UPDATED_AT,
    description: 'Field to sort by (e.g., createdAt, updatedAt)',
  })
  @IsOptional()
  @IsEnum(orderSortBy)
  sortBy?: string = orderSortBy.UPDATED_AT;

  @ApiProperty({
    name: 'order_status',
    enum: order_status,
    required: false,
    description: 'Filter by order status',
    example: order_status.PENDING,
  })
  @IsEnum(order_status)
  @Type(() => Number)
  @IsOptional()
  order_status?: order_status;

  @IsEnum(payment_status)
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    name: 'payment_status',
    enum: payment_status,
    required: false,
    description: 'Filter by payment status',
    example: payment_status.PAID,
  })
  payment_status?: payment_status;

  @IsEnum(payment_method_name)
  @IsOptional()
  @ApiProperty({
    name: 'payment_method',
    enum: payment_method_name,
    required: false,
    description: 'Filter by payment method',
    example: payment_method_name.COD,
  })
  payment_method?: payment_method_name;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_from',
    required: false,
    description: 'Filter orders created from a specific date',
    example: '2021-01-01',
  })
  created_from?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    name: 'created_to',
    required: false,
    format: 'iso8601',
    description: 'Filter orders created to a specific date',
    example: '2021-01-01',
  })
  created_to?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    name: 'delivery_method',
    required: false,
    description: 'Filter by delivery method ID',
    example: '',
  })
  delivery_method?: string;
}
