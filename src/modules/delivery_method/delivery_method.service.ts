import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDeliveryMethodDto } from './dto/create-delivery_method.dto';
import { UpdateDeliveryMethodDto } from './dto/update-delivery_method.dto';
import { BaseService } from '../Base/Base.service';
import { ResponseDeliveryMethodDto } from './dto/response-dellivery_method.dto';
import { DeliveryMethod } from './entities/delivery_method.entity';
import { Base } from '../Base/entities/Base.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { transformDto } from 'src/helpers/transformObjectDto';
import { extractPublicId } from 'cloudinary-build-url';

@Injectable()
export class DeliveryMethodService extends BaseService<
  DeliveryMethod,
  CreateDeliveryMethodDto,
  UpdateDeliveryMethodDto,
  ResponseDeliveryMethodDto
> {
  constructor(
    cloudinaryService: CloudinaryService,
    @InjectRepository(DeliveryMethod)
    private readonly deliveryMethodRepo: Repository<DeliveryMethod>,
  ) {
    super(
      deliveryMethodRepo,
      CreateDeliveryMethodDto,
      UpdateDeliveryMethodDto,
      ResponseDeliveryMethodDto,
      'DeliveryMethod',
      cloudinaryService,
    );
  }
  async create(dto: CreateDeliveryMethodDto): Promise<{
    status: number;
    message: string;
    data: ResponseDeliveryMethodDto;
  }> {
    try {
      return await super.create(dto);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new ConflictException('Name already exists');
      }
      throw e;
    }
  }

  async update(
    id: string,
    dto: UpdateDeliveryMethodDto,
  ): Promise<{
    status: number;
    message: string;
    data: ResponseDeliveryMethodDto;
  }> {
    try {
      const oldDeliveryMethod = await this.deliveryMethodRepo.findOneBy({ id });
      if (!oldDeliveryMethod)
        throw new NotFoundException('Delivery method not found');
      const oldLogo = oldDeliveryMethod.logo;

      await this.removeFileByPublicId(extractPublicId(oldLogo));
      const newLogo = dto.logo;

      const updateDeliveryMethod = {
        ...dto,
        logo: newLogo ? newLogo : oldLogo,
      };

      const transform = transformDto(
        ResponseDeliveryMethodDto,
        updateDeliveryMethod,
      );
      return {
        status: 200,
        message: 'Delivery method updated successfully',
        data: transform,
      };
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new ConflictException('Name already exists');
      }
      throw e;
    }
  }

  async findAll(relations?: string[]): Promise<ResponseDeliveryMethodDto[]> {
    return super.findAll(relations);
  }

  async findOneBy(
    prop: string,
    value: string,
    relations?: string[],
  ): Promise<{
    status: number;
    message: string;
    data: ResponseDeliveryMethodDto;
  }> {
    return super.findOneBy(prop, value, relations);
  }

  async remove(id: string): Promise<{
    status: boolean;
    message: string;
    data: ResponseDeliveryMethodDto;
  }> {
    try {
      const { logo } = await this.deliveryMethodRepo.findOneBy({ id });
      await this.removeFileByPublicId(extractPublicId(logo));
      return super.remove(id);
    } catch (e) {
      throw e;
    }
  }
}
