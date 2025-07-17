import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([Branch, Warehouse])],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
