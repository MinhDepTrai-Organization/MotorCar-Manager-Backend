import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryMethodController } from './delivery_method.controller';
import { DeliveryMethodService } from './delivery_method.service';

describe('DeliveryMethodController', () => {
  let controller: DeliveryMethodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryMethodController],
      providers: [DeliveryMethodService],
    }).compile();

    controller = module.get<DeliveryMethodController>(DeliveryMethodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
