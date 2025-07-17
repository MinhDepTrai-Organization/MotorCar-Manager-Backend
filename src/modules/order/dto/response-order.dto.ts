import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  getStatusKeyByEnumType,
  order_status,
  payment_status,
} from 'src/constants/order_status.enum';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { DeliveryMethod } from 'src/modules/delivery_method/entities/delivery_method.entity';
import { ResponseOrderDetailDto } from 'src/modules/order_detail/dto/response-order_detail.dto';
import { OrderDetail } from 'src/modules/order_detail/entities/order_detail.entity';
import { PaymentMethod } from 'src/modules/payment_method/entities/payment_method.entity';
import { ReceiveAddressEntity } from 'src/modules/receive_address/entities/receive_address.entity';

export class ResponseOrderDto {
  @ApiProperty({
    name: 'id',
    description: 'The order id',
    type: 'string',
    format: 'UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @Expose()
  id: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj?.customer) {
      return {
        id: obj.customer.id,
        username: obj.customer.username,
        email: obj.customer.email,
        phoneNumber: obj.customer.phoneNumber,
        avatarUrl: obj.customer.avatarUrl,
      };
    }
  })
  @ApiProperty({
    name: 'customer',
    description: 'The customer information',
    type: 'object',
    required: true,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'customer1',
      email: 'example@gmail.com',
      phoneNumber: '0123456789',
      avatarUrl: 'https://example.com/avatar.jpg',
    },
  })
  customer: Customer;

  @Expose()
  @Transform(({ obj }) => {
    if (obj?.receiveAddress) {
      const receiveAddress = obj.receiveAddress;
      return {
        id: receiveAddress.id,
        receiver_name: receiveAddress.receiver_name,
        receiver_phone: receiveAddress.receiver_phone,
        address: `${receiveAddress.street}, ${receiveAddress.ward}, ${receiveAddress.district}, ${receiveAddress.province}`,
        postal_code: receiveAddress.postal_code,
        note: receiveAddress.note,
      };
    }
  })
  @ApiProperty({
    name: 'receive_address',
    description: 'The receive address information',
    type: 'object',
    required: true,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      receiver_name: 'John Doe',
      receiver_phone: '0123456789',
      address: '123 Street, Ward, District, Province',
      postal_code: '700000',
      note: 'This is my main address',
    },
  })
  receive_address: ReceiveAddressEntity;

  @ApiProperty({
    name: 'order_status',
    description: 'The status of the order',
    type: 'string',
    required: true,
    example: 'PENDING',
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      return getStatusKeyByEnumType(Number(value), order_status);
    } catch (e) {
      const message =
        e instanceof Object && 'message' in e
          ? e.message
          : 'Invalid order status';
      throw new Error(`Error transforming order status: ${message}`);
    }
  })
  order_status: string;

  @ApiProperty({
    name: 'order_note',
    description: 'Note of the order',
    type: 'string',
    required: false,
    example: 'Please call me before delivery',
  })
  @Expose()
  note?: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj?.orderDetails) {
      const orderDetails = obj.orderDetails;
      return orderDetails.map((orderDetail: OrderDetail) => {
        const skus = orderDetail.skus;
        let responseObj = {
          id: orderDetail.id,
          quantity: orderDetail.quantity,
          skus: {
            product: {},
          },
        };
        if (skus) {
          const { product, ...res } = skus;
          responseObj = {
            ...responseObj,
            skus: {
              ...res,
              product: {},
            },
          };
        }

        if (skus?.product) {
          responseObj.skus.product = {
            id: skus.product.id,
            title: skus.product.title,
          };
        }

        return responseObj;
      });
    }
  })
  @ApiProperty({
    name: 'order_details',
    description: 'The order details',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'UUID',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        skus: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'UUID',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            masku: {
              type: 'string',
              example: '123-1xsa',
            },
            barcode: {
              type: 'string',
              example: '123-1xsa.123',
            },
            name: {
              type: 'string',
              example: 'Variant name',
            },
            pricesold: {
              type: 'number',
              example: 100000,
            },
            image: {
              type: 'string',
              example: 'https://example.com/image.jpg',
            },
            product_id: {
              type: 'string',
              format: 'UUID',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            product_title: {
              type: 'string',
              example: 'Product title',
            },
          },
        },
        quantity: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  order_details: ResponseOrderDetailDto[];

  @ApiProperty({
    name: 'total_price',
    description: 'The total price of the order',
    type: 'number',
    required: true,
    example: 250000.53,
  })
  @Expose()
  total_price: number;

  @ApiProperty({
    name: 'discount_price',
    description: 'The discount price of the order',
    type: 'number',
    required: true,
    example: 25000.53,
  })
  @Expose()
  discount_price: number;

  @Expose()
  @Transform(({ obj }) => {
    if (obj?.paymentMethod) {
      const paymentMethod = obj.paymentMethod;
      return {
        id: paymentMethod.id,
        name: paymentMethod.name,
        description: paymentMethod.description,
        logo: paymentMethod.logo,
      };
    }
  })
  @ApiProperty({
    name: 'payment_method',
    description: 'The payment method',
    type: 'object',
    required: true,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Cash on delivery',
      description: 'Payment when receive the order',
      logo: 'https://example.com/logo.jpg',
    },
  })
  payment_method: PaymentMethod;

  @ApiProperty({
    name: 'payment_status',
    description: 'The payment status',
    type: 'string',
    required: true,
    example: 'PAID',
  })
  @Expose()
  @Transform(({ value }) => {
    try {
      return getStatusKeyByEnumType(Number(value), payment_status);
    } catch (e) {
      const message =
        e instanceof Object && 'message' in e
          ? e.message
          : 'Invalid payment status';
      throw new Error(`Error transforming payment status: ${message}`);
    }
  })
  payment_status: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj?.deliveryMethod) {
      const deliveryMethod = obj.deliveryMethod;
      return {
        id: deliveryMethod.id,
        name: deliveryMethod.name,
        description: deliveryMethod.description,
        logo: deliveryMethod.logo,
      };
    }
  })
  @ApiProperty({
    name: 'delivery_method',
    description: 'The delivery method',
    type: 'object',
    required: true,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Standard delivery',
      description: 'Delivery within 3 days',
      logo: 'https://example.com/logo.jpg',
    },
  })
  delivery_method: DeliveryMethod;
  @ApiProperty({
    name: 'delivery_time',
    description: 'The delivery time',
    type: 'string',
    format: 'date-time',
    example: '2021-07-21T17:32:28.000Z',
    required: false,
  })
  @Expose()
  delivery_time: Date | null;

  @Expose()
  @ApiProperty({
    name: 'refund_time',
    description: 'The refund time',
    type: 'string',
    format: 'date-time',
    example: '2021-07-21T17:32:28.000Z',
    required: false,
  })
  refund_time: Date | null;

  // @Expose()
  // @ApiProperty({
  //   name: 'refund_reason',
  //   description: 'The refund reason',
  //   type: 'string',
  //   example: 'Customer request',
  //   required: false,
  // })
  // refund_reason?: string;

  @Expose()
  @ApiProperty({
    name: 'created_at',
    description: 'The created date of the order',
    type: 'string',
    format: 'date-time',
    example: '2021-07-21T17:32:28.000Z',
  })
  createdAt: Date;
  @Expose()
  @ApiProperty({
    name: 'updated_at',
    description: 'The updated date of the order',
    type: 'string',
    format: 'date-time',
    example: '2021-07-21T17:32:28.000Z',
  })
  updatedAt: Date;
  @Expose()
  @ApiProperty({
    name: 'deleted_at',
    description: 'The deleted date of the order',
    type: 'string',
    format: 'date-time',
    example: '2021-07-21T17:32:28.000Z',
  })
  deletedAt: Date | null;
}
