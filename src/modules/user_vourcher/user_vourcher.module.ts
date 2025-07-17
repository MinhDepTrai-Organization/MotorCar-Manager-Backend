import { Module } from '@nestjs/common';
import { UserVourcherService } from './user_vourcher.service';
import { UserVourcherController } from './user_vourcher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVourcher } from './entities/user_vourcher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserVourcher])],
  controllers: [UserVourcherController],
  providers: [UserVourcherService],
  exports:[UserVourcherService]
})
export class UserVourcherModule {}
