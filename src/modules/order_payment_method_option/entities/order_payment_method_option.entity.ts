import { Order } from 'src/modules/order/entities/order.entity';
import { PaymentMethodOption } from 'src/modules/payment_method_option/entities/payment_method_option.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order_payment_method_option')
@Unique('unique_order_payment_method_option', ['order', 'paymentMethodOption'])
export class OrderPaymentMethodOption {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Order, (order: Order) => order.OrderPaymentMethodOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'orderId',
  })
  order: Order;

  @Column({
    type: 'text',
    nullable: false,
  })
  value: string;

  @ManyToOne(
    () => PaymentMethodOption,
    (paymentMethodOption: PaymentMethodOption) =>
      paymentMethodOption.orderPaymentMethodOptions,
  )
  paymentMethodOption: PaymentMethodOption;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
