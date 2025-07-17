import { Base } from 'src/modules/Base/entities/Base.entity';
import { CartItem } from 'src/modules/cart_item/entities/cart_item.entity';
import { DetailExport } from 'src/modules/detail_export/entities/detail_export.entity';
import { DetailImport } from 'src/modules/detail_import/entities/detail_import.entity';
import { OptionValue } from 'src/modules/option_value/entities/option_value.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { OrderDetail } from 'src/modules/order_detail/entities/order_detail.entity';
import { Products } from 'src/modules/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('skus')
export class Skus extends Base {
  @Column({ type: 'varchar' })
  masku: string;

  @Column({ type: 'varchar' })
  barcode: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({
    type: 'numeric',
    default: 0,
    nullable: false,
  })
  price_sold: number;

  @Column({
    type: 'numeric',
    default: 0,
    nullable: false,
  })
  price_compare: number;

  @Column({ type: 'text', nullable: true, default: null })
  image: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne((type) => Products, (element) => element.skus, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Products;

  @OneToMany((type) => DetailImport, (element) => element.skus)
  detail_import: DetailImport[];

  @OneToMany((type) => OptionValue, (element) => element.skus)
  optionValue: OptionValue[];

  @OneToMany((type) => DetailExport, (element) => element.skus)
  detail_export: DetailExport[];

  @OneToMany(() => CartItem, (element) => element.skus)
  cart_item: CartItem[];

  @OneToMany(() => OrderDetail, (orderDetail: OrderDetail) => orderDetail.skus)
  orderDetails: OrderDetail[];
}
