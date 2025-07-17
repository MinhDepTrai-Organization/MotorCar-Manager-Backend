import { Module } from '@nestjs/common';
import { PaymentMethodOptionController } from './payment_method_option.controller';
import { PaymentMethodOptionService } from './payment_method_option.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodOption } from './entities/payment_method_option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodOption])],
  controllers: [PaymentMethodOptionController],
  providers: [PaymentMethodOptionService],
  exports: [PaymentMethodOptionService],
})
export class PaymentMethodOptionModule {}
