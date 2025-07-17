import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { ResponseOrderDetailDto } from './dto/response-order_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { Repository } from 'typeorm';
import { Order } from '../order/entities/order.entity';
import { Skus } from '../skus/entities/skus.entity';
import { transformDto } from 'src/helpers/transformObjectDto';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
  ) {}
  async create(createOrderDetailDto: CreateOrderDetailDto): Promise<{
    status: number;
    message: string;
    data: ResponseOrderDetailDto;
  }> {
    try {
      const { order_id, skus_id } = createOrderDetailDto;
      const order = await this.orderDetailRepository.manager.findOne(Order, {
        where: {
          id: order_id,
        },
      });
      if (!order) {
        throw new NotFoundException(`Order not found`);
      }

      const skus = await this.orderDetailRepository.manager.findOne(Skus, {
        where: {
          id: skus_id,
        },
        relations: ['product'],
      });
      if (!skus) {
        throw new NotFoundException(`Skus not found`);
      }

      const newOrderDetail = {
        ...createOrderDetailDto,
        order_id,
        skus,
      };

      const createOrderDetail =
        this.orderDetailRepository.create(newOrderDetail);

      const res = await this.orderDetailRepository.save(createOrderDetail);

      return {
        status: 201,
        message: 'Create a new order detail successfully',
        data: transformDto(ResponseOrderDetailDto, res),
      };
    } catch (e) {
      throw e;
    }
  }
}
