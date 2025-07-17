import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DetailExportService } from './detail_export.service';
import { CreateDetailExportDto } from './dto/create-detail_export.dto';
import { UpdateDetailExportDto } from './dto/update-detail_export.dto';
import { Tag } from 'src/constants/api-tag.enum';
import { ApiTags } from '@nestjs/swagger';

// @ApiTags(Tag.DETAIL_EXPORT)
@Controller('detail-export')
export class DetailExportController {
  constructor(private readonly detailExportService: DetailExportService) {}

  @Post()
  create(@Body() createDetailExportDto: CreateDetailExportDto) {
    return this.detailExportService.create(createDetailExportDto);
  }

  @Get()
  findAll() {
    return this.detailExportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailExportService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDetailExportDto: UpdateDetailExportDto,
  ) {
    return this.detailExportService.update(id, updateDetailExportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailExportService.remove(id);
  }
}
