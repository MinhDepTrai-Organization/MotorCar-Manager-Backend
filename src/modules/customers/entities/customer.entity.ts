import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Conversation } from 'src/modules/conversation/entities/conversation.entity';
// import { BlockUser } from 'src/modules/block-user/entities/block-user.entity';
// import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { ReceiveAddressEntity } from 'src/modules/receive_address/entities/receive_address.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { UserVourcher } from 'src/modules/user_vourcher/entities/user_vourcher.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('Customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  age: number;

  @OneToMany(() => Order, (order: Order) => order.customer)
  orders: Order[];

  @OneToMany(
    () => ReceiveAddressEntity,
    (receive_address: ReceiveAddressEntity) => receive_address.customer,
  )
  receive_address: ReceiveAddressEntity[];

  @Column({ nullable: true })
  phoneNumber: string;
  @Column({
    default:
      'https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png',
  })
  avatarUrl: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  birthday: Date;

  @Column({ default: false })
  isActice: boolean;

  // Thêm trường giới tính
  @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'other' })
  gender: 'male' | 'female' | 'other';

  @Column()
  codeId: string;

  @Column()
  codeExprided: Date;

  @OneToMany(() => Blog, (blog: Blog) => blog.customer)
  blogs: Blog[];

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Conversation, (conversation) => conversation.customer)
  conversations: Conversation[];

  @OneToMany(() => Message, (message) => message.customer)
  messages: Message[];

  @OneToOne(() => Cart, (element) => element.customer)
  cart: Cart;
  @OneToMany(() => UserVourcher, (element) => element.customer)
  uservoucher: UserVourcher[];

  @ManyToOne(() => Role, (role) => role.customer)
  @JoinColumn({ name: 'role_id' })
  Roles: Role;

  @OneToMany(() => Review, (review) => review.customer)
  reviews: Review[];
}
