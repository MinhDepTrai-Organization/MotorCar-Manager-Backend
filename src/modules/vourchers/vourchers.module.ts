import { Module } from '@nestjs/common';
import { VourchersService } from './vourchers.service';
import { VourchersController } from './vourchers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './entities/vourcher.entity';
import { UserVourcher } from '../user_vourcher/entities/user_vourcher.entity';
import { TypeVoucher } from '../type_voucher/entities/type_voucher.entity';
import { Customer } from '../customers/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher,UserVourcher,TypeVoucher,Customer])],
  controllers: [VourchersController],
  providers: [VourchersService],
  exports:[VourchersService]
})
export class VourchersModule {}
