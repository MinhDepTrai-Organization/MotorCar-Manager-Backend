import { Test, TestingModule } from '@nestjs/testing';
import { TypeVoucherService } from './type_voucher.service';

describe('TypeVoucherService', () => {
  let service: TypeVoucherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeVoucherService],
    }).compile();

    service = module.get<TypeVoucherService>(TypeVoucherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
