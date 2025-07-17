import { Test, TestingModule } from '@nestjs/testing';
import { DetailExportController } from './detail_export.controller';
import { DetailExportService } from './detail_export.service';

describe('DetailExportController', () => {
  let controller: DetailExportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailExportController],
      providers: [DetailExportService],
    }).compile();

    controller = module.get<DetailExportController>(DetailExportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
