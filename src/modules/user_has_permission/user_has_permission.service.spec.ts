import { Test, TestingModule } from '@nestjs/testing';
import { UserHasPermissionService } from './user_has_permission.service';

describe('UserHasPermissionService', () => {
  let service: UserHasPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserHasPermissionService],
    }).compile();

    service = module.get<UserHasPermissionService>(UserHasPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
