import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Category } from '../category/entities/category.entity';
import { CarImage } from '../car-image/entities/car-image.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Warehouse } from '../warehouse/entities/warehouse.entity';

import { Specification } from '../specification/entities/specification.entity';
import { SkusModule } from '../skus/skus.module';
import { OptionModule } from '../option/option.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { ImportModule } from '../import/import.module';
import { DetailImportModule } from '../detail_import/detail_import.module';
import { OptionValueModule } from '../option_value/option_value.module';
import { Skus } from '../skus/entities/skus.entity';
import { OptionValue } from '../option_value/entities/option_value.entity';
import { Option } from '../option/entities/option.entity';
import { Import } from '../import/entities/import.entity';
import { DetailImport } from '../detail_import/entities/detail_import.entity';

@Module({
  imports: [
    CloudinaryModule,
    TypeOrmModule.forFeature([
      Products,
      Brand,
      Category,
      CarImage,
      Warehouse,
      Specification,
      Skus,
      OptionValue,
      Option,
      Import,
      DetailImport,
    ]),
    SkusModule,
    OptionModule,
    WarehouseModule,
    ImportModule,
    DetailImportModule,
    OptionValueModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
