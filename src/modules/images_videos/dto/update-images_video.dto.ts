import { PartialType } from '@nestjs/mapped-types';
import { CreateImagesVideoDto } from './create-images_video.dto';

export class UpdateImagesVideoDto extends PartialType(CreateImagesVideoDto) {}
