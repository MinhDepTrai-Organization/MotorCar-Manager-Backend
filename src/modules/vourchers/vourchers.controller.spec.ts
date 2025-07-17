import { Test, TestingModule } from '@nestjs/testing';
import { VourchersController } from './vourchers.controller';
import { VourchersService } from './vourchers.service';

describe('VourchersController', () => {
  let controller: VourchersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VourchersController],
      providers: [VourchersService],
    }).compile();

    controller = module.get<VourchersController>(VourchersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
