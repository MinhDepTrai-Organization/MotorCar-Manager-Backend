import { payment_status } from 'src/constants/order_status.enum';
import { Order } from 'src/modules/order/entities/order.entity';
import { PaymentMethod } from 'src/modules/payment_method/entities/payment_method.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_transaction')
export class PaymentTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order: Order) => order.paymentTransactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @ManyToOne(
    () => PaymentMethod,
    (paymentMethod: PaymentMethod) => paymentMethod.paymentTransactions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'payment_method_id',
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'bigint',
    nullable: true,
    unique: true,
  })
  payment_order_id: number; //orderID dạng số cho PayOS
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  transaction_id: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: payment_status,
    default: payment_status.PENDING,
  })
  status: payment_status;

  @Column({
    type: 'json',
    nullable: true,
  })
  payment_data: any;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
