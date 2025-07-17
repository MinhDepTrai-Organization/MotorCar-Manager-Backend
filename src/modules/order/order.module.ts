import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ExportModule } from '../export/export.module';
import { ZaloPaymentModule } from '../zalo-payment/zalo-payment.module';
import { DetailImportModule } from '../detail_import/detail_import.module';
import { PaymentMethodOption } from '../payment_method_option/entities/payment_method_option.entity';
import { PayosModule } from '../payos/payos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, PaymentMethodOption]),
    ExportModule,
    PayosModule,
    DetailImportModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
