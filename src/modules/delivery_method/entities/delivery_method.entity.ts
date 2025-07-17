import { Base } from 'src/modules/Base/entities/Base.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('delivery_method')
export class DeliveryMethod extends Base {
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 100,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({ nullable: false, type: 'int' })
  fee: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  logo?: string;

  @OneToMany(() => Order, (order: Order) => order.deliveryMethod)
  orders: Order[];
}
