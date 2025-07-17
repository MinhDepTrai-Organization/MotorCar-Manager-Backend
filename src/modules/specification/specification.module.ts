import { Module } from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { SpecificationController } from './specification.controller';
import { Specification } from './entities/specification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Specification])],
  controllers: [SpecificationController],
  providers: [SpecificationService],
})
export class SpecificationModule {}
