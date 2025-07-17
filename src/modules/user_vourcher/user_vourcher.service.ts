import { Injectable } from '@nestjs/common';
import { CreateUserVourcherDto } from './dto/create-user_vourcher.dto';
import { UpdateUserVourcherDto } from './dto/update-user_vourcher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVourcher } from './entities/user_vourcher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserVourcherService {
  constructor(
    @InjectRepository(UserVourcher)
    private userVoucherRepository: Repository<UserVourcher>,
  ) {}

  hanlegetVoucher(createUserVourcherDto: CreateUserVourcherDto) {}

  findAll() {
    return `This action returns all userVourcher`;
  }

  async findOne(user) {
    const data = await this.userVoucherRepository.find({
      where: {
        customer: { id: user.id },
        is_used: false,
      },
      relations: { voucher: true },
    });

    return data;
  }
  async findOne_UserVoucher(id, user) {
    const data = await this.userVoucherRepository.findOne({
      where: {
        id: id,
      },
      relations: { voucher: true },
    });
    return data;
  }

  update(id: number, updateUserVourcherDto: UpdateUserVourcherDto) {
    return `This action updates a #${id} userVourcher`;
  }

  remove(id: number) {
    return `This action removes a #${id} userVourcher`;
  }
}
