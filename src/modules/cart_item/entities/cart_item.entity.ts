import { Base } from 'src/modules/Base/entities/Base.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Skus } from 'src/modules/skus/entities/skus.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cart_item')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Cart, (element) => element.cartItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column()
  quantity: number; // Số lượng sản phẩm

  @ManyToOne(() => Skus, (element) => element.cart_item, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skus_id' })
  skus: Skus;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Thời gian tạo bản ghi',
  })
  createdAt: Date;
}
