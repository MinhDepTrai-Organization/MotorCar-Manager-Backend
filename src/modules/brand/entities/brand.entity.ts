import { Category } from 'src/modules/category/entities/category.entity';
import { Products } from 'src/modules/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('brand')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string; // Mô tả về thương hiệu

  @Column()
  thumbnailUrl: string;

  //Mối quan hệ 1-N: Một thương hiệu có thể có nhiều sản phẩm
  @OneToMany((type) => Products, (product) => product.brand)
  productId: Products[];

  @CreateDateColumn()
  created_at: Date; // Ngày tạo

  @UpdateDateColumn()
  updated_at: Date; // Ngày cập nhật
}
