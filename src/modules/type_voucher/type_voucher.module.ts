import { Module } from '@nestjs/common';
import { TypeVoucherService } from './type_voucher.service';
import { TypeVoucherController } from './type_voucher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeVoucher } from './entities/type_voucher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeVoucher])],
  controllers: [TypeVoucherController],
  providers: [TypeVoucherService],
})
export class TypeVoucherModule {}
