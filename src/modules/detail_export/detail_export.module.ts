import { Module } from '@nestjs/common';
import { DetailExportService } from './detail_export.service';
import { DetailExportController } from './detail_export.controller';

@Module({
  controllers: [DetailExportController],
  providers: [DetailExportService],
})
export class DetailExportModule {}
