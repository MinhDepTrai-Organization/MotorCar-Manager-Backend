import { Test, TestingModule } from '@nestjs/testing';
import { ImagesVideosService } from './images_videos.service';

describe('ImagesVideosService', () => {
  let service: ImagesVideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesVideosService],
    }).compile();

    service = module.get<ImagesVideosService>(ImagesVideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
