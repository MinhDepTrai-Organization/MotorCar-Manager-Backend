import { OrderPaymentMethodOption } from 'src/modules/order_payment_method_option/entities/order_payment_method_option.entity';
import { PaymentMethod } from 'src/modules/payment_method/entities/payment_method.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_method_option')
export class PaymentMethodOption {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  description: string;

  @ManyToOne(
    () => PaymentMethod,
    (paymentMethod: PaymentMethod) => paymentMethod.paymentMethodOptions,
  )
  @JoinColumn({
    name: 'payment_method_id',
  })
  paymentMethod: PaymentMethod;

  @OneToMany(
    () => OrderPaymentMethodOption,
    (orderPaymentMethodOption: OrderPaymentMethodOption) =>
      orderPaymentMethodOption.paymentMethodOption,
  )
  orderPaymentMethodOptions: OrderPaymentMethodOption[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
