import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { BaseService } from './Base.service';

@Module({
  imports: [CloudinaryModule],
  providers: [BaseService],
})
export class BlogModule {}
