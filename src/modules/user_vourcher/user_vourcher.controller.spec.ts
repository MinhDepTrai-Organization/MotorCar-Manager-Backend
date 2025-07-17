import { Test, TestingModule } from '@nestjs/testing';
import { UserVourcherController } from './user_vourcher.controller';
import { UserVourcherService } from './user_vourcher.service';

describe('UserVourcherController', () => {
  let controller: UserVourcherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserVourcherController],
      providers: [UserVourcherService],
    }).compile();

    controller = module.get<UserVourcherController>(UserVourcherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
