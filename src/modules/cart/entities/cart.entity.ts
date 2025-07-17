import { Base } from 'src/modules/Base/entities/Base.entity';
import { CartItem } from 'src/modules/cart_item/entities/cart_item.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => Customer, (element) => element.cart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
  @OneToMany(() => CartItem, (element) => element.cart)
  cartItem: CartItem[];
}
