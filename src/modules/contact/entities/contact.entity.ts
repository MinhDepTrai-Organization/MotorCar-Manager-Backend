import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
export enum EnumContact {
  Quote = 'Báo giá sản phẩm',
  Order = 'Đặt hàng sản phẩm',
  Maintenance = 'Đặt lịch bảo dưỡng',
}
@Entity('Contact')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  order_product_name: string;

  @Column({
    type: 'enum',
    enum: EnumContact,
    default: EnumContact.Quote,
  })
  service: EnumContact;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  maintenance_date: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
