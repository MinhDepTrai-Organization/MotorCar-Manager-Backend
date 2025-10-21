import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { ILike, Repository } from 'typeorm';
import { Message } from '@solana/web3.js';
import typeorm from 'src/config/typeorm.config';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
  ) {}
  async create(createOptionDto: CreateOptionDto) {
    const name = createOptionDto.name;
    const ExistName = await this.optionRepository.findOne({
      // field : data
      where: { name: ILike(name) },
    });
    if (ExistName) {
      throw new NotFoundException({
        status: 404,
        message: 'Thuộc tính đã tồn tại',
      });
    }
    //bạn đang create() một đối tượng mới từ DTO
    const newOption = this.optionRepository.create(createOptionDto);
    const data = await this.optionRepository.save(newOption);
    return {
      message: 'Tạo Thuộc tính thành công',
      data,
    };
  }

  async findAll() {
    const data = await this.optionRepository.find();
    return {
      status: 200,
      message: 'Lấy danh sách thuộc tính thành công',
      data,
    };
  }

  async findOne(id: string) {
    const option = await this.optionRepository.findOne({ where: { id } });

    if (!option) {
      throw new NotFoundException({
        status: 404,
        message: 'Thuộc tính không tồn tại',
      });
    }

    return {
      status: 200,
      message: 'Lấy thông tin thuộc tính thành công',
      data: option,
    };
  }

  async update(id: string, updateOptionDto: UpdateOptionDto) {
    const option = await this.optionRepository.findOne({ where: { id } });
    const { name } = updateOptionDto;
    if (!option) {
      throw new NotFoundException({
        status: 404,
        message: 'Thuộc tính không tồn tại',
      });
    }
    // check trùng
    const existingOption = await this.optionRepository.findOne({
      where: { name: ILike(name) }, // ko phân biệt hoa thuong
    });
    if (existingOption) {
      throw new HttpException('Tên thuộc tính đã tồn tại', HttpStatus.CONFLICT); // 409
    }

    // Cập nhật dữ liệu
    await this.optionRepository.update(id, updateOptionDto);

    // Lấy dữ liệu mới sau khi cập nhật
    const updatedOption = await this.optionRepository.findOne({
      where: { id },
    });

    return {
      message: 'Cập nhật thuộc tính thành công',
      data: updatedOption,
    };
  }

  async remove(id: string) {
    const option = await this.optionRepository.findOne({ where: { id } });

    if (!option) {
      throw new NotFoundException({
        status: 404,
        message: 'Thuộc tính không tồn tại',
      });
    }
    await this.optionRepository.delete(id);

    return {
      status: 200,
      message: 'Xóa thuộc tính thành công',
    };
  }
}
