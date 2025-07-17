import { Module } from '@nestjs/common';
import { ImagesVideosService } from './images_videos.service';
import { ImagesVideosController } from './images_videos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesVideo } from './entities/images_video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImagesVideo])],
  controllers: [ImagesVideosController],
  providers: [ImagesVideosService],
})
export class ImagesVideosModule {}
