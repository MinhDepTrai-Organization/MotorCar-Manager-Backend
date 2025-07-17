import { Test, TestingModule } from '@nestjs/testing';
import { TypeVoucherController } from './type_voucher.controller';
import { TypeVoucherService } from './type_voucher.service';

describe('TypeVoucherController', () => {
  let controller: TypeVoucherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeVoucherController],
      providers: [TypeVoucherService],
    }).compile();

    controller = module.get<TypeVoucherController>(TypeVoucherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
