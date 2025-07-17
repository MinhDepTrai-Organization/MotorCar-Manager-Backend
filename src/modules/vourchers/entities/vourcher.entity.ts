import { Base } from 'src/modules/Base/entities/Base.entity';
import { TypeVoucher } from 'src/modules/type_voucher/entities/type_voucher.entity';
import { UserVourcher } from 'src/modules/user_vourcher/entities/user_vourcher.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('vouchers')
export class Voucher extends Base {
  @Column()
  voucher_code: string;

  @Column()
  voucher_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  uses: number;

  @Column({ nullable: true })
  limit: number;

  @Column({ nullable: true })
  max_uses_user: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_amount: number;

  @Column({ default: false })
  fixed: boolean;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'expired'],
    default: 'active',
  })
  status: 'active' | 'inactive' | 'expired';

  @ManyToOne(() => TypeVoucher, (element) => element.vouchers)
  @JoinColumn({ name: 'typeVoucherId' })
  type_voucher: TypeVoucher;

  @OneToMany(() => UserVourcher, (userVoucher) => userVoucher.voucher)
  users: UserVourcher[];

  // Thêm ngày bắt đầu và ngày kết thúc
  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;

  @Column({ nullable: true, default: 0 })
  count_user_get: number;
}
