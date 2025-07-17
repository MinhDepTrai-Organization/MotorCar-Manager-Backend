import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { Order } from 'src/modules/order/entities/order.entity';
import { PaymentMethodOption } from 'src/modules/payment_method_option/entities/payment_method_option.entity';

export class ResponseOrderPaymentMethodOption {
  @Expose()
  @ApiProperty({
    type: Number,
    format: 'int',
    description: 'id of order payment method option',
    example: 1,
  })
  id: number;
  @Expose()
  @Transform(({ obj }) => {
    if (obj.order) {
      const order = obj.order;
      const paymentMethod = order.paymentMethod;
      return {
        paymentMethod: {
          id: paymentMethod.id,
          name: paymentMethod.name,
          description: paymentMethod.description,
        },
      };
    }
  })
  @ApiProperty({
    type: 'object',
    description: 'order object',
    example: {
      id: 'uuid',
    },
  })
  order: Order;
  @Expose()
  @Transform(({ obj }) => {
    if (obj.paymentMethodOption) {
      const paymentMethodOption = obj.paymentMethodOption;
      return {
        id: paymentMethodOption.id,
        name: paymentMethodOption.name,
        description: paymentMethodOption.description,
      };
    }
  })
  @ApiProperty({
    type: 'object',
    description: 'payment method option object',
    example: {
      id: 1,
      name: 'app_id',
      description: 'the id of the payment option',
    },
  })
  paymentMethodOption: PaymentMethodOption;
  @Expose()
  @ApiProperty({
    type: String,
    description: 'value of the payment method option',
    example: '123456',
  })
  value: string;
}
