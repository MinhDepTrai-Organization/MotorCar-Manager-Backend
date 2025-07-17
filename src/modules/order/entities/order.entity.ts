import { order_status, payment_status } from 'src/constants/order_status.enum';
import { Base } from 'src/modules/Base/entities/Base.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { DeliveryMethod } from 'src/modules/delivery_method/entities/delivery_method.entity';
import { DeliveryStatus } from 'src/modules/delivery_status/entities/delivery_status.entity';
import { Export } from 'src/modules/export/entities/export.entity';
import { OrderDetail } from 'src/modules/order_detail/entities/order_detail.entity';
import { OrderPaymentMethodOption } from 'src/modules/order_payment_method_option/entities/order_payment_method_option.entity';
import { PaymentMethod } from 'src/modules/payment_method/entities/payment_method.entity';
import { PaymentTransaction } from 'src/modules/payment_transaction/entities/payment_transaction.entity';
import { ReceiveAddressEntity } from 'src/modules/receive_address/entities/receive_address.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('order')
export class Order extends Base {
  @ManyToOne(() => Customer, (customer: Customer) => customer.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'customer_id',
  })
  customer: Customer;

  @ManyToOne(
    () => ReceiveAddressEntity,
    (entity: ReceiveAddressEntity) => entity.orders,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'receive_address_id',
  })
  receiveAddress: ReceiveAddressEntity;

  @OneToMany(() => OrderDetail, (orderDetail: OrderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];

  @Column({
    type: 'enum',
    enum: order_status,
    default: order_status.PENDING,
  })
  order_status: order_status;

  @Column({
    type: 'float',
    nullable: false,
  })
  total_price: number;

  @Column({
    type: 'float',
    nullable: false,
  })
  discount_price: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string;

  @ManyToOne(
    () => PaymentMethod,
    (paymentMethod: PaymentMethod) => paymentMethod.orders,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'payment_method_id',
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  payment_time: Date;

  @Column({
    type: 'enum',
    default: payment_status.PENDING,
    enum: payment_status,
  })
  payment_status: payment_status;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  payment_url: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  payment_url_expired: Date;

  @OneToMany(
    () => OrderPaymentMethodOption,
    (orderPaymentMethodOption: OrderPaymentMethodOption) =>
      orderPaymentMethodOption.order,
  )
  OrderPaymentMethodOptions: OrderPaymentMethodOption[];

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  refund_time: Date;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  refund_reason: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  failed_delivery_reason: string;

  @ManyToOne(
    () => DeliveryMethod,
    (deliveryMethod: DeliveryMethod) => deliveryMethod.orders,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'delivery_method_id',
  })
  deliveryMethod: DeliveryMethod;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  delivery_time: Date;

  @OneToMany(
    () => DeliveryStatus,
    (deliveryStatus: DeliveryStatus) => deliveryStatus.order,
  )
  delivery_status: DeliveryStatus[];

  @OneToOne(() => Export, (exportData) => exportData.order, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  export: Export;

  @OneToMany(() => Review, (review) => review.order)
  reviews: Review[];

  @OneToMany(
    () => PaymentTransaction,
    (paymentTransaction) => paymentTransaction.order,
  )
  paymentTransactions: PaymentTransaction[];
}
