import { Test, TestingModule } from '@nestjs/testing';
import { DetailImportController } from './detail_import.controller';
import { DetailImportService } from './detail_import.service';

describe('DetailImportController', () => {
  let controller: DetailImportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetailImportController],
      providers: [DetailImportService],
    }).compile();

    controller = module.get<DetailImportController>(DetailImportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
