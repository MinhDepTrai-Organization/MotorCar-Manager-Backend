import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImagesVideosService } from './images_videos.service';
import { CreateImagesVideoDto } from './dto/create-images_video.dto';
import { UpdateImagesVideoDto } from './dto/update-images_video.dto';

@Controller('images-videos')
export class ImagesVideosController {
  constructor(private readonly imagesVideosService: ImagesVideosService) {}

  @Post()
  create(@Body() createImagesVideoDto: CreateImagesVideoDto) {
    return this.imagesVideosService.create(createImagesVideoDto);
  }

  @Get()
  findAll() {
    return this.imagesVideosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesVideosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImagesVideoDto: UpdateImagesVideoDto) {
    return this.imagesVideosService.update(+id, updateImagesVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesVideosService.remove(+id);
  }
}
