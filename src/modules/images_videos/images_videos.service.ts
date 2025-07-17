import { Injectable } from '@nestjs/common';
import { CreateImagesVideoDto } from './dto/create-images_video.dto';
import { UpdateImagesVideoDto } from './dto/update-images_video.dto';

@Injectable()
export class ImagesVideosService {
  create(createImagesVideoDto: CreateImagesVideoDto) {
    return 'This action adds a new imagesVideo';
  }

  findAll() {
    return `This action returns all imagesVideos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imagesVideo`;
  }

  update(id: number, updateImagesVideoDto: UpdateImagesVideoDto) {
    return `This action updates a #${id} imagesVideo`;
  }

  remove(id: number) {
    return `This action removes a #${id} imagesVideo`;
  }
}
