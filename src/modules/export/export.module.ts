import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Export } from './entities/export.entity';
import { DetailExport } from '../detail_export/entities/detail_export.entity';
import { DetailImport } from '../detail_import/entities/detail_import.entity';
import { Import } from '../import/entities/import.entity';
import { Skus } from '../skus/entities/skus.entity';
import { DetailImportModule } from '../detail_import/detail_import.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Export,
      DetailExport,
      DetailImport,
      Import,
      Skus,
    ]),
    DetailImportModule,
  ],
  controllers: [ExportController],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
