import { Base } from 'src/modules/Base/entities/Base.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Voucher } from 'src/modules/vourchers/entities/vourcher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user_voucher')
export class UserVourcher {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Customer, (element) => element.uservoucher, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
  @ManyToOne(() => Voucher, (element) => element.users)
  @JoinColumn({ name: 'voucher_id' }) // Hỗ trợ từ 0.3.x
  voucher: Voucher;

  @Column({ default: false })
  is_used: boolean;

  @Column({ type: 'timestamp', nullable: true })
  used_at: Date;
}
