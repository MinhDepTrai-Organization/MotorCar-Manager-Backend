import { Customer } from 'src/modules/customers/entities/customer.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (admin) => admin.conversations)
  @JoinColumn({ name: 'adminId' })
  admin: User;

  @ManyToOne(() => Customer, (customer) => customer.conversations)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
}
