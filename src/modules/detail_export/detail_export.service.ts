import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetailExportDto } from './dto/create-detail_export.dto';
import { UpdateDetailExportDto } from './dto/update-detail_export.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DetailExport } from './entities/detail_export.entity';
import { Repository } from 'typeorm';
import { Export } from '../export/entities/export.entity';

@Injectable()
export class DetailExportService {
  constructor(
    @InjectRepository(DetailExport)
    private readonly DetailReposity: Repository<DetailExport>,
    @InjectRepository(Export)
    private readonly ExportReposity : Repository<Export>
  ) {}
  create(createDetailExportDto: CreateDetailExportDto) {
    return 'This action adds a new detailExport';
  }

  findAll() {
    return this.DetailReposity.find();
  }

  findOne(id: string) {
    return this.DetailReposity.findOne({ where: { id } });
  }

  async update(id: string, updateDetailExportDto: UpdateDetailExportDto) {
    const detailExport = await this.DetailReposity.findOne({
      where: { id },
    });

    if (!detailExport) {
      throw new NotFoundException(`Detail export with ID ${id} not found`);
    }

    await this.DetailReposity.update(id, updateDetailExportDto);
    return {
      message: `Detail export #${id} updated successfully`,
      data: updateDetailExportDto,
    };
  }

  async remove(id: string) {
    const detailExport = await this.DetailReposity.findOne({
      where: { id },
    });

    if (!detailExport) {
      throw new NotFoundException(`Detail export with ID ${id} not found`);
    }

    await this.DetailReposity.delete(id);
    return { message: `Detail export #${id} deleted successfully` };
  }
}
