import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}
  async create(createWarehouseDto: CreateWarehouseDto): Promise<{
    status: number;
    message: string;
    data: Warehouse;
  }> {
    const warehouse = this.warehouseRepository.create(createWarehouseDto);
    const data = await this.warehouseRepository.save(warehouse);
    return {
      status: 201,
      message: 'Tạo mới kho thành công',
      data,
    };
  }

  async findAll() {
    const warehouses = await this.warehouseRepository.find();
    return {
      status: 200,
      message: 'Lấy danh sách kho thành công',
      data: warehouses,
    };
  }
  async findOne(id: string) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException('Kho không tồn tại');
    }
    return {
      status: 200,
      message: 'Lấy thông tin kho thành công',
      data: warehouse,
    };
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException('Kho không tồn tại');
    }

    Object.assign(warehouse, updateWarehouseDto);
    await this.warehouseRepository.save(warehouse);

    return {
      status: 200,
      message: 'Cập nhật kho thành công',
      data: warehouse,
    };
  }
  async remove(id: string) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id } });
    if (!warehouse) {
      throw new NotFoundException('Kho không tồn tại');
    }

    await this.warehouseRepository.delete(id);
    return {
      status: 204,
      message: 'Xóa kho thành công',
    };
  }
}
