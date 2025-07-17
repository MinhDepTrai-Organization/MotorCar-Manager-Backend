import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Products } from '../products/entities/product.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Products,Category]), CloudinaryModule],
  controllers: [BrandController],
  providers: [BrandService],
  exports: [BrandService, TypeOrmModule],
})
export class BrandModule {}
