import { Base } from 'src/modules/Base/entities/Base.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('receive_address')
@Unique('unique_customer_address', [
  'customer',
  'street',
  'ward',
  'district',
  'province',
])
export class ReceiveAddressEntity extends Base {
  @ManyToOne(() => Customer, (customer: Customer) => customer.receive_address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'customer_id',
  })
  customer: Customer;

  @OneToMany(() => Order, (order: Order) => order.receiveAddress)
  orders: Order[];

  @Column({
    type: 'varchar',
    nullable: false,
  })
  receiver_name: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  receiver_phone: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  street: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  ward: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  district: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  province: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  postal_code: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  is_default: boolean;
}
