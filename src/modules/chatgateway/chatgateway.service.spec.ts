import { Test, TestingModule } from '@nestjs/testing';
import { ChatgatewayService } from './chatgateway.service';

describe('ChatgatewayService', () => {
  let service: ChatgatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatgatewayService],
    }).compile();

    service = module.get<ChatgatewayService>(ChatgatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
