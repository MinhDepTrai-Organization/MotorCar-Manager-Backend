import { Test, TestingModule } from '@nestjs/testing';
import { OrderPaymentMethodOptionService } from './order_payment_method_option.service';

describe('OrderPaymentMethodOptionService', () => {
  let service: OrderPaymentMethodOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderPaymentMethodOptionService],
    }).compile();

    service = module.get<OrderPaymentMethodOptionService>(OrderPaymentMethodOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
