import { Module } from '@nestjs/common';
import { OrderPaymentMethodOptionService } from './order_payment_method_option.service';
import { OrderPaymentMethodOptionController } from './order_payment_method_option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderPaymentMethodOption } from './entities/order_payment_method_option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderPaymentMethodOption])],
  controllers: [OrderPaymentMethodOptionController],
  providers: [OrderPaymentMethodOptionService],
  exports: [OrderPaymentMethodOptionService],
})
export class OrderPaymentMethodOptionModule {}
