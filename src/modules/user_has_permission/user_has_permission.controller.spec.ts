import { Test, TestingModule } from '@nestjs/testing';
import { UserHasPermissionController } from './user_has_permission.controller';
import { UserHasPermissionService } from './user_has_permission.service';

describe('UserHasPermissionController', () => {
  let controller: UserHasPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserHasPermissionController],
      providers: [UserHasPermissionService],
    }).compile();

    controller = module.get<UserHasPermissionController>(UserHasPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
