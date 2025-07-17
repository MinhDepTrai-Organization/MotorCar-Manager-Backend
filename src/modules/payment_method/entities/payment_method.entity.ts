import { payment_method_name } from 'src/constants/order_status.enum';
import { Base } from 'src/modules/Base/entities/Base.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { PaymentMethodOption } from 'src/modules/payment_method_option/entities/payment_method_option.entity';
import { PaymentTransaction } from 'src/modules/payment_transaction/entities/payment_transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payment_method')
export class PaymentMethod extends Base {
  @Column({
    type: 'enum',
    nullable: false,
    unique: true,
    enum: payment_method_name,
  })
  name: payment_method_name;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  logo: string;

  @OneToMany(() => Order, (order: Order) => order.paymentMethod)
  orders: Order[];

  @OneToMany(
    () => PaymentMethodOption,
    (paymentMethodOption: PaymentMethodOption) =>
      paymentMethodOption.paymentMethod,
  )
  paymentMethodOptions: PaymentMethodOption[];

  @OneToMany(
    () => PaymentTransaction,
    (paymentTransaction: PaymentTransaction) =>
      paymentTransaction.paymentMethod,
  )
  paymentTransactions: PaymentTransaction[];
}
