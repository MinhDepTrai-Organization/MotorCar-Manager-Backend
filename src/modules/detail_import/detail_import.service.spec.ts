import { Test, TestingModule } from '@nestjs/testing';
import { DetailImportService } from './detail_import.service';

describe('DetailImportService', () => {
  let service: DetailImportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetailImportService],
    }).compile();

    service = module.get<DetailImportService>(DetailImportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
