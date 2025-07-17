import { Test, TestingModule } from '@nestjs/testing';
import { VourchersService } from './vourchers.service';

describe('VourchersService', () => {
  let service: VourchersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VourchersService],
    }).compile();

    service = module.get<VourchersService>(VourchersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
