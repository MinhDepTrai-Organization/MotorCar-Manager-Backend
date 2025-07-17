import {
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
} from 'typeorm';
import { OrderDetail } from '../entities/order_detail.entity';
import { Order } from '../../order/entities/order.entity';

@EventSubscriber()
export class OrderDetailSubscriber
  implements EntitySubscriberInterface<OrderDetail>
{
  listenTo() {
    return OrderDetail;
  }

  async afterDelete(event: RemoveEvent<OrderDetail>) {
    const orderDetailRepository = event.manager.getRepository(OrderDetail);
    const orderRepository = event.manager.getRepository(Order);

    const orderId = event.entity.order?.id;

    if (orderId) {
      const orderDetailCount = await orderDetailRepository.count({
        where: { order: { id: orderId } },
      });

      if (orderDetailCount === 0) {
        await orderRepository.delete(orderId);
      }
    }
  }
}
