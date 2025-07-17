import { Test, TestingModule } from '@nestjs/testing';
import { UserVourcherService } from './user_vourcher.service';

describe('UserVourcherService', () => {
  let service: UserVourcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserVourcherService],
    }).compile();

    service = module.get<UserVourcherService>(UserVourcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
