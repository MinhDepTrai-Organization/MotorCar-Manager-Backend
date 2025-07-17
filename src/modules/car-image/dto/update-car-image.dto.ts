import { PartialType } from '@nestjs/swagger';
import { CreateCarImageDto } from './create-car-image.dto';

export class UpdateCarImageDto extends PartialType(CreateCarImageDto) {}
