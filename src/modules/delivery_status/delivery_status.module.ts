import { Module } from '@nestjs/common';
import { DeliveryStatusService } from './delivery_status.service';
import { DeliveryStatusController } from './delivery_status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryStatus } from './entities/delivery_status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryStatus])],
  controllers: [DeliveryStatusController],
  providers: [DeliveryStatusService],
})
export class DeliveryStatusModule {}
