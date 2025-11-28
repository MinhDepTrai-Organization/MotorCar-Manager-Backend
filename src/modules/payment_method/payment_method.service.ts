import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment_method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment_method.dto';
import { BaseService } from '../Base/Base.service';
import { PaymentMethod } from './entities/payment_method.entity';
import { ResponsePaymentMethodDto } from './dto/response-payment_method.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { extractPublicId } from 'cloudinary-build-url';
import { transformDto } from 'src/helpers/transformObjectDto';

@Injectable()
export class PaymentMethodService extends BaseService<
  PaymentMethod,
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
  ResponsePaymentMethodDto
> {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    cloudinaryService: CloudinaryService,
  ) {
    super(
      paymentMethodRepository,
      CreatePaymentMethodDto,
      UpdatePaymentMethodDto,
      ResponsePaymentMethodDto,
      'Payment method',
      cloudinaryService,
    );
  }

  async create(dto: CreatePaymentMethodDto): Promise<{
    status: number;
    message: string;
    data: ResponsePaymentMethodDto;
  }> {
    try {
      return await super.create(dto);
    } catch (e) {
      if (
        e instanceof Object &&
        e !== null &&
        'code' in e &&
        e.code === '23505'
      ) {
        throw new ConflictException('Payment method name already exists');
      }
      throw e;
    }
  }

  async update(
    id: string,
    dto: UpdatePaymentMethodDto,
  ): Promise<{
    status: number;
    message: string;
    data: ResponsePaymentMethodDto;
  }> {
    try {
      const paymentMethod = await this.paymentMethodRepository.findOne({
        where: {
          id,
        },
      });
      if (!paymentMethod)
        throw new NotFoundException(
          'Not found any payment method with the given ID',
        );
      const oldLogo = paymentMethod.logo;
      const publicIdLogo = extractPublicId(oldLogo);
      await this.removeFileByPublicId(publicIdLogo);
      const newPaymentMethod = {
        ...paymentMethod,
        id,
        ...dto,
      };
      const updatedPaymentMethod =
        await this.paymentMethodRepository.save(newPaymentMethod);
      return {
        status: 200,
        message: 'Payment method updated successfully',
        data: transformDto(ResponsePaymentMethodDto, updatedPaymentMethod),
      };
    } catch (e) {
      if (
        e instanceof Object &&
        e !== null &&
        'code' in e &&
        e.code === '23505'
      ) {
        throw new ConflictException('Payment method name already exists');
      }
      throw e;
    }
  }

  async findAllPaymentMethodNames(): Promise<string[]> {
    return await this.paymentMethodRepository
      .find({
        select: ['name'],
      })
      .then((paymentMethods) => {
        return paymentMethods.map((paymentMethod) => paymentMethod.name);
      });
  }
}
