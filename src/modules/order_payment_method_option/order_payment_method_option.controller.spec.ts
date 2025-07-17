import { Test, TestingModule } from '@nestjs/testing';
import { OrderPaymentMethodOptionController } from './order_payment_method_option.controller';
import { OrderPaymentMethodOptionService } from './order_payment_method_option.service';

describe('OrderPaymentMethodOptionController', () => {
  let controller: OrderPaymentMethodOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderPaymentMethodOptionController],
      providers: [OrderPaymentMethodOptionService],
    }).compile();

    controller = module.get<OrderPaymentMethodOptionController>(OrderPaymentMethodOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
