import { Module } from '@nestjs/common';
import { ReceiveAddressService } from './receive_address.service';
import { ReceiveAddressController } from './receive_address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiveAddressEntity } from './entities/receive_address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReceiveAddressEntity])],
  controllers: [ReceiveAddressController],
  providers: [ReceiveAddressService],
})
export class ReceiveAddressModule {}
