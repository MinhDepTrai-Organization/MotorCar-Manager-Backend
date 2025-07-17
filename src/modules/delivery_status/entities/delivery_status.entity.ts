import { Order } from 'src/modules/order/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('delivery_status')
export class DeliveryStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order: Order) => order.delivery_status, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  location: string; // Vị trí cụ thể (ví dụ: "Bangkok", "Cảng Hải Phòng", "TP.HCM")

  @Column({
    type: 'text',
    nullable: false,
  })
  status_note: string; // Ghi chú bổ sung (ví dụ: "Hàng đang chờ thông quan")

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  status_time: Date; // Thời gian xảy ra trạng thái

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
