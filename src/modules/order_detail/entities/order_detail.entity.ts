import { Base } from 'src/modules/Base/entities/Base.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Skus } from 'src/modules/skus/entities/skus.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('order_detail')
@Unique('unique_order_detail', ['order', 'skus'])
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Order, (order: Order) => order.orderDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @ManyToOne(() => Skus, (skus: Skus) => skus.orderDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'skus_id',
  })
  skus: Skus;

  @Column({
    type: 'int',
    nullable: false,
  })
  quantity: number;
}
