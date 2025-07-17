import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeVoucherModule } from '../type_voucher/type_voucher.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { User } from '../user/entities/user.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Role } from '../role/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User,Customer,Role])],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
