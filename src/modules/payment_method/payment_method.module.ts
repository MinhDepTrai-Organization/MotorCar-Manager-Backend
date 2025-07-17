import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment_method.service';
import { PaymentMethodController } from './payment_method.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment_method.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PaymentMethodOption } from '../payment_method_option/entities/payment_method_option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentMethod, PaymentMethodOption]),
    CloudinaryModule,
  ],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
})
export class PaymentMethodModule {}
