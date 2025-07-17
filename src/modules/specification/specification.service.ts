import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';
import { Specification } from './entities/specification.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SpecificationService {
  constructor(
    @InjectRepository(Specification)
    private readonly specificationRepository: Repository<Specification>,
  ) {}
  create(createSpecificationDto: CreateSpecificationDto) {
    return 'This action adds a new specification';
  }

  async findAll() {
    try {
      const specifications = await this.specificationRepository.find();
      return {
        status: 200,
        message: 'Get all specifications successfully',
        data: specifications,
      };
    } catch (e) {
      throw e;
    }
  }

  async findByProductId(productId: string) {
    try {
      const specifications = await this.specificationRepository.find({
        where: {
          product: {
            id: productId,
          },
        },
      });
      if(!specifications) {
        throw new BadRequestException('No specifications found for this product');
      }
      return {
        status: 200,
        message: 'Get specifications by productId successfully',
        data: specifications,
      };
    } catch (e) {
      throw e;
    }
  }
}
