import { Module } from '@nestjs/common';
import { PaymentTransactionService } from './payment_transaction.service';
import { PaymentTransactionController } from './payment_transaction.controller';

@Module({
  controllers: [PaymentTransactionController],
  providers: [PaymentTransactionService],
})
export class PaymentTransactionModule {}
