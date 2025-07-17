import { Products } from 'src/modules/products/entities/product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
@Entity()
export class CarImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  count: number | null; // Cập nhật kiểu dữ liệu để hỗ trợ null


  @JoinColumn({ name: 'product_id' })
  car: Products;
  // xóa sp sẽ xóa car
}
