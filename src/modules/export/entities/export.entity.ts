import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Base } from 'src/modules/Base/entities/Base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { DetailExport } from 'src/modules/detail_export/entities/detail_export.entity';
import { Order } from 'src/modules/order/entities/order.entity';
@Entity('export')
export class Export extends Base {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  note?: string;
  @ManyToOne(() => User, (user) => user.export)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => DetailExport, (element) => element.export)
  detail_export: DetailExport[];

  @OneToOne(() => Order, (order) => order.export, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
