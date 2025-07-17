import { Test, TestingModule } from '@nestjs/testing';
import { DetailExportService } from './detail_export.service';

describe('DetailExportService', () => {
  let service: DetailExportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailExportService],
    }).compile();

    service = module.get<DetailExportService>(DetailExportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
