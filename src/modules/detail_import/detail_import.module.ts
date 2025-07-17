import { Module } from '@nestjs/common';
import { DetailImportService } from './detail_import.service';
import { DetailImportController } from './detail_import.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailImport } from './entities/detail_import.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Import } from '../import/entities/import.entity';
import { Skus } from '../skus/entities/skus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailImport,Warehouse,Import,Skus])],
  controllers: [DetailImportController],
  providers: [DetailImportService],
  exports:[DetailImportService]
})
export class DetailImportModule {}
