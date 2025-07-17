import { forwardRef, Module } from '@nestjs/common';
import { ZaloPaymentService } from './zalo-payment.service';
import { ZaloPaymentController } from './zalo-payment.controller';
import { OrderModule } from '../order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/entities/order.entity';
import { PaymentMethodOptionModule } from '../payment_method_option/payment_method_option.module';
import { OrderPaymentMethodOption } from '../order_payment_method_option/entities/order_payment_method_option.entity';
import { OrderPaymentMethodOptionModule } from '../order_payment_method_option/order_payment_method_option.module';

@Module({
  imports: [
    OrderModule,
    PaymentMethodOptionModule,
    OrderPaymentMethodOptionModule,
    TypeOrmModule.forFeature([Order, OrderPaymentMethodOption]),
  ],
  controllers: [ZaloPaymentController],
  providers: [ZaloPaymentService],
  exports: [ZaloPaymentService],
})
export class ZaloPaymentModule {}
