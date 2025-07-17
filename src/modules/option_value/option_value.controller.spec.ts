import { Test, TestingModule } from '@nestjs/testing';
import { OptionValueController } from './option_value.controller';
import { OptionValueService } from './option_value.service';

describe('OptionValueController', () => {
  let controller: OptionValueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionValueController],
      providers: [OptionValueService],
    }).compile();

    controller = module.get<OptionValueController>(OptionValueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
