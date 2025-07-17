import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { BlogCategory } from '../blog-categories/entities/blog-category.entity';

@Module({
  imports: [CloudinaryModule, TypeOrmModule.forFeature([Blog, BlogCategory])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
