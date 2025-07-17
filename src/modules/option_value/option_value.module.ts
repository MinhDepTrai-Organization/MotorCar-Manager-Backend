import { Module } from '@nestjs/common';
import { OptionValueService } from './option_value.service';
import { OptionValueController } from './option_value.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionValue } from './entities/option_value.entity';
import { Skus } from '../skus/entities/skus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionValue,Skus])],
  controllers: [OptionValueController],
  providers: [OptionValueService],
  exports:[OptionValueService]
})
export class OptionValueModule {}
