import { Test, TestingModule } from '@nestjs/testing';
import { CarImageController } from './car-image.controller';
import { CarImageService } from './car-image.service';

describe('CarImageController', () => {
  let controller: CarImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarImageController],
      providers: [CarImageService],
    }).compile();

    controller = module.get<CarImageController>(CarImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
