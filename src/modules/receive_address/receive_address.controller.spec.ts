import { Test, TestingModule } from '@nestjs/testing';
import { ReceiveAddressController } from './receive_address.controller';
import { ReceiveAddressService } from './receive_address.service';

describe('ReceiveAddressController', () => {
  let controller: ReceiveAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiveAddressController],
      providers: [ReceiveAddressService],
    }).compile();

    controller = module.get<ReceiveAddressController>(ReceiveAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
