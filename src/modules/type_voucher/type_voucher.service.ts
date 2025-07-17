import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeVoucherDto } from './dto/create-type_voucher.dto';
import { UpdateTypeVoucherDto } from './dto/update-type_voucher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeVoucher } from './entities/type_voucher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeVoucherService {
  constructor(
    @InjectRepository(TypeVoucher)
    private readonly typeVoucherRepository: Repository<TypeVoucher>,
  ) {}
  // Tạo mới một TypeVoucher
  async create(
    createTypeVoucherDto: CreateTypeVoucherDto,
  ): Promise<TypeVoucher> {
    const typeVoucher = this.typeVoucherRepository.create(createTypeVoucherDto);
    return await this.typeVoucherRepository.save(typeVoucher);
  }

  // Lấy tất cả TypeVoucher
  async findAll(): Promise<TypeVoucher[]> {
    return await this.typeVoucherRepository.find({
      relations: ['vouchers'], // Nếu muốn load mối quan hệ với vouchers
    });
  }

  // Lấy một TypeVoucher theo ID
  async findOne(id: string): Promise<TypeVoucher> {
    const typeVoucher = await this.typeVoucherRepository.findOne({
      where: { id: id },
      relations: ['vouchers'], // Nếu muốn load mối quan hệ với vouchers
    });
    if (!typeVoucher) {
      throw new NotFoundException(`TypeVoucher with ID ${id} not found`);
    }
    return typeVoucher;
  }

  async update(id: string, updateTypeVoucherDto: UpdateTypeVoucherDto) {
    const typeVoucher = await this.findOne(id); // Kiểm tra xem TypeVoucher có tồn tại không
    Object.assign(typeVoucher, updateTypeVoucherDto); // Gán các giá trị mới
    const data = await this.typeVoucherRepository.save(typeVoucher);
    return {
      message: 'Cập nhật thành công',
      data: data,
    };
  }

  // Xóa TypeVoucher
  async remove(id: string): Promise<void> {
    const typeVoucher = await this.findOne(id); // Kiểm tra xem TypeVoucher có tồn tại không
    await this.typeVoucherRepository.remove(typeVoucher);
  }
}
