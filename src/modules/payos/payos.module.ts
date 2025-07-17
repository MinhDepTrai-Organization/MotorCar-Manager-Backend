import { Module } from '@nestjs/common';
import { PayosService } from './payos.service';
import { PayosController } from './payos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransaction } from '../payment_transaction/entities/payment_transaction.entity';
import { Order } from '../order/entities/order.entity';
import { Voucher } from '../vourchers/entities/vourcher.entity';
import { UserVourcher } from '../user_vourcher/entities/user_vourcher.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentTransaction,
      Order,
      Voucher,
      UserVourcher,
    ]),
  ],
  controllers: [PayosController],
  providers: [PayosService],
  exports: [PayosService],
})
export class PayosModule {}
