import { Test, TestingModule } from '@nestjs/testing';
import { ReceiveAddressService } from './receive_address.service';

describe('ReceiveAddressService', () => {
  let service: ReceiveAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiveAddressService],
    }).compile();

    service = module.get<ReceiveAddressService>(ReceiveAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
