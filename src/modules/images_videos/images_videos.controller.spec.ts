import { Test, TestingModule } from '@nestjs/testing';
import { ImagesVideosController } from './images_videos.controller';
import { ImagesVideosService } from './images_videos.service';

describe('ImagesVideosController', () => {
  let controller: ImagesVideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesVideosController],
      providers: [ImagesVideosService],
    }).compile();

    controller = module.get<ImagesVideosController>(ImagesVideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
