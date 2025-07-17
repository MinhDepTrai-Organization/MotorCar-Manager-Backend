import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodOption } from './entities/payment_method_option.entity';
import { Repository } from 'typeorm';
import { CreatePaymentMethodOptionDto } from './dto/create-payment_method_option.dto';
import { ResponsePaymentMethodOptionDto } from './dto/response-payment_method_option.dto';
import { PaymentMethod } from '../payment_method/entities/payment_method.entity';
import { transformDto } from 'src/helpers/transformObjectDto';
import { ResponsePaymentMethodDto } from '../payment_method/dto/response-payment_method.dto';

@Injectable()
export class PaymentMethodOptionService {
  constructor(
    @InjectRepository(PaymentMethodOption)
    private readonly paymentMethodOptionRepository: Repository<PaymentMethodOption>,
  ) {}

  async findOne(
    id: number,
    relation = [],
  ): Promise<{
    status: number;
    message: string;
    data: ResponsePaymentMethodOptionDto;
  }> {
    try {
      const paymentMethodOption =
        await this.paymentMethodOptionRepository.findOne({
          where: { id },
          relations: relation.length === 0 ? ['paymentMethod'] : relation,
        });
      if (!paymentMethodOption) {
        throw new NotFoundException('Payment method option not found');
      }
      return {
        status: 200,
        message: 'Payment method option found',
        data: transformDto(ResponsePaymentMethodOptionDto, paymentMethodOption),
      };
    } catch (e) {
      throw e;
    }
  }
  async create(createDto: CreatePaymentMethodOptionDto): Promise<{
    status: number;
    message: string;
    data: ResponsePaymentMethodOptionDto;
  }> {
    try {
      const { paymentMethodId } = createDto;
      const paymentMethod =
        await this.paymentMethodOptionRepository.manager.findOne(
          PaymentMethod,
          {
            where: {
              id: paymentMethodId,
            },
          },
        );
      if (!paymentMethod) {
        throw new NotFoundException('Payment method not found');
      }
      const saveData = {
        ...createDto,
        paymentMethod: paymentMethod,
      };
      const paymentMethodOptionData =
        this.paymentMethodOptionRepository.create(saveData);
      const res = await this.paymentMethodOptionRepository.save(
        paymentMethodOptionData,
      );
      return {
        status: 201,
        message: 'Payment method option created',
        data: transformDto(ResponsePaymentMethodOptionDto, res),
      };
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: number,
    updateDto: CreatePaymentMethodOptionDto,
  ): Promise<{
    status: number;
    message: string;
    data: ResponsePaymentMethodOptionDto;
  }> {
    try {
      const { paymentMethodId } = updateDto;
      const paymentMethodOption =
        await this.paymentMethodOptionRepository.findOne({
          where: { id },
        });
      if (!paymentMethodOption) {
        throw new NotFoundException('Payment method option not found');
      }
      const paymentMethod =
        await this.paymentMethodOptionRepository.manager.findOne(
          PaymentMethod,
          {
            where: {
              id: paymentMethodId,
            },
          },
        );
      if (!paymentMethod) {
        throw new NotFoundException('Payment method not found');
      }
      const saveData = {
        ...paymentMethodOption,
        ...updateDto,
        paymentMethod: paymentMethod,
      };
      const res = await this.paymentMethodOptionRepository.save(saveData);
      return {
        status: 200,
        message: 'Payment method option updated',
        data: transformDto(ResponsePaymentMethodOptionDto, res),
      };
    } catch (e) {
      throw e;
    }
  }

  async remove(id: number): Promise<{
    status: number;
    message: string;
    data: ResponsePaymentMethodOptionDto;
  }> {
    try {
      const paymentMethodOption =
        await this.paymentMethodOptionRepository.findOne({
          where: { id },
          relations: ['paymentMethod'],
        });

      if (!paymentMethodOption) {
        throw new NotFoundException('Payment method option not found');
      }
      const res =
        await this.paymentMethodOptionRepository.remove(paymentMethodOption);
      return {
        status: 200,
        message: 'Payment method option deleted',
        data: transformDto(ResponsePaymentMethodOptionDto, res),
      };
    } catch (e) {
      throw e;
    }
  }

  async findAll(relation = []): Promise<{
    status: number;
    message: string;
    data: ResponsePaymentMethodOptionDto[];
  }> {
    try {
      const paymentMethodOptions =
        await this.paymentMethodOptionRepository.find({
          relations: relation.length === 0 ? ['paymentMethod'] : relation,
        });
      return {
        status: 200,
        message: 'Payment method options found',
        data: paymentMethodOptions.map((item) =>
          transformDto(ResponsePaymentMethodOptionDto, item),
        ),
      };
    } catch (e) {
      throw e;
    }
  }

  async findOneByName(name: string): Promise<{
    status: number;
    message: string;
    data: ResponsePaymentMethodOptionDto;
  }> {
    try {
      const result = await this.paymentMethodOptionRepository.findOne({
        where: { name },
      });
      if (!result) {
        throw new NotFoundException('Payment method option not found');
      }
      return {
        status: 200,
        message: 'Payment method found',
        data: transformDto(
          ResponsePaymentMethodOptionDto,
          await this.paymentMethodOptionRepository.findOne({ where: { name } }),
        ),
      };
    } catch (e) {
      throw e;
    }
  }
}
