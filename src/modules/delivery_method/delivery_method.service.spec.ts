import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryMethodService } from './delivery_method.service';

describe('DeliveryMethodService', () => {
  let service: DeliveryMethodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryMethodService],
    }).compile();

    service = module.get<DeliveryMethodService>(DeliveryMethodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
