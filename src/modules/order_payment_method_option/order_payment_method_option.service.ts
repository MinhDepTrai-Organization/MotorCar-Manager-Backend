import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderPaymentMethodOptionDto } from './dto/create-order_payment_method_option.dto';
import { UpdateOrderPaymentMethodOptionDto } from './dto/update-order_payment_method_option.dto';
import { ResponseOrderPaymentMethodOption } from './dto/response-order-payment_method_option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderPaymentMethodOption } from './entities/order_payment_method_option.entity';
import { Not, Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { getRelations, transformDto } from 'src/helpers/transformObjectDto';
import { PaymentMethodOption } from '../payment_method_option/entities/payment_method_option.entity';

@Injectable()
export class OrderPaymentMethodOptionService {
  constructor(
    @InjectRepository(OrderPaymentMethodOption)
    private repo: Repository<OrderPaymentMethodOption>,
  ) {}

  async validateDto(
    dto: CreateOrderPaymentMethodOptionDto | UpdateOrderPaymentMethodOptionDto,
    id?: number,
    relations: string[] = [],
  ) {
    try {
      if (!dto) {
        throw new Error('Invalid order payment method DTO provided');
      }
      relations = relations.length > 0 ? relations : getRelations(this.repo);
      let res: {
        orderPaymentMethodOption: OrderPaymentMethodOption;
        order: Order;
        paymentMethodOption: PaymentMethodOption;
      } = {} as any;

      const [order, paymentMethodOption, existingOpmp] = await Promise.all([
        this.repo.manager.findOne(Order, {
          where: { id: dto.order_id },
          relations: ['OrderPaymentMethodOptions', 'paymentMethod'],
        }),
        this.repo.manager.findOne(PaymentMethodOption, {
          where: { id: dto.payment_method_option_id },
        }),
        this.repo.findOne({
          where: {
            order: { id: dto.order_id },
            paymentMethodOption: { id: dto.payment_method_option_id },
          },
        }),
      ]);

      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (!paymentMethodOption) {
        throw new NotFoundException('Payment method option not found');
      }

      // check if order payment method option already exists when creating new order payment method option
      if (!id) {
        if (existingOpmp) {
          throw new BadRequestException(
            'Order payment method option already exists',
          );
        }
      }

      // if id exists, find the order payment method option
      if (id) {
        const orderPaymentMethodOption = await this.repo.findOne({
          where: { id },
          relations: relations,
        });
        if (!orderPaymentMethodOption) {
          throw new NotFoundException('Order payment method option not found');
        }

        const exitingOtherOpmp = await this.repo.findOne({
          where: {
            order: { id: dto.order_id },
            paymentMethodOption: { id: dto.payment_method_option_id },
            id: Not(id),
          },
        });

        if (exitingOtherOpmp) {
          throw new BadRequestException(
            'Order payment method option already exists',
          );
        }

        res.orderPaymentMethodOption = orderPaymentMethodOption;
      }

      res.order = order;
      res.paymentMethodOption = paymentMethodOption;

      return res;
    } catch (e) {
      throw e;
    }
  }

  async create(dto: CreateOrderPaymentMethodOptionDto): Promise<{
    status: number;
    message: string;
    data: ResponseOrderPaymentMethodOption;
  }> {
    try {
      const { order, paymentMethodOption } = await this.validateDto(dto);
      const savedData = this.repo.create({
        ...dto,
        order,
        paymentMethodOption,
      });
      const resData = await this.repo.save(savedData);
      return {
        status: 201,
        message: 'Order payment method option created successfully',
        data: transformDto(ResponseOrderPaymentMethodOption, resData),
      };
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: number,
    dto: UpdateOrderPaymentMethodOptionDto,
  ): Promise<{
    status: number;
    message: string;
    data: ResponseOrderPaymentMethodOption;
  }> {
    try {
      const { order, paymentMethodOption, orderPaymentMethodOption } =
        await this.validateDto(dto, id);
      const updatedData = {
        ...orderPaymentMethodOption,
        ...dto,
        order,
        paymentMethodOption,
      };
      const resData = await this.repo.save(updatedData);
      return {
        status: 200,
        message: 'Order payment method option updated successfully',
        data: transformDto(ResponseOrderPaymentMethodOption, resData),
      };
    } catch (e) {
      throw e;
    }
  }

  async findOne(
    id: number,
    relations: string[] = [],
  ): Promise<{
    status: number;
    message: string;
    data: ResponseOrderPaymentMethodOption;
  }> {
    try {
      relations = relations.length > 0 ? relations : getRelations(this.repo);
      const orderPaymentMethodOption = await this.repo.findOne({
        where: { id },
        relations,
      });
      if (!orderPaymentMethodOption) {
        throw new NotFoundException('Order payment method option not found');
      }
      return {
        status: 200,
        message: 'Order payment method option found',
        data: orderPaymentMethodOption,
      };
    } catch (e) {
      throw e;
    }
  }

  async findOneByOrderIdAndPaymentMethodOptionId(
    orderId: string,
    paymentMethodOptionId: number,
  ): Promise<{
    status: number;
    message: string;
    data: ResponseOrderPaymentMethodOption;
  }> {
    try {
      const orderPaymentMethodOption = await this.repo.findOne({
        where: {
          order: { id: orderId },
          paymentMethodOption: { id: paymentMethodOptionId },
        },
      });
      if (!orderPaymentMethodOption) {
        throw new NotFoundException('Order payment method option not found');
      }
      return {
        status: 200,
        message: 'Order payment method option found',
        data: transformDto(
          ResponseOrderPaymentMethodOption,
          orderPaymentMethodOption,
        ),
      };
    } catch (e) {
      throw e;
    }
  }
}
