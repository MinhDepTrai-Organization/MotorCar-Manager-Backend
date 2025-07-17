import { Module } from '@nestjs/common';
import { UserHasPermissionService } from './user_has_permission.service';
import { UserHasPermissionController } from './user_has_permission.controller';

@Module({
  controllers: [UserHasPermissionController],
  providers: [UserHasPermissionService],
})
export class UserHasPermissionModule {}
