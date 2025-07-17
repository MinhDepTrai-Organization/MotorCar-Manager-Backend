import { ProductType } from 'src/constants';
import { Base } from 'src/modules/Base/entities/Base.entity';
import { Brand } from 'src/modules/brand/entities/brand.entity';

import { Products } from 'src/modules/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category extends Base {
  @Column({
    unique: true,
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  slug: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: ProductType,
    default: ProductType.CAR,
  })
  type: ProductType;

  @Column()
  name: string;
  @Column()
  description: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE', // Khi xóa danh mục cha, các danh mục con sẽ bị xóa tự động trong databse
  })
  // khóa ngoại
  @JoinColumn({ name: 'parentCategoryId' })
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory, {
    cascade: ['remove'], // Chỉ định hành động cascade là remove,
    onDelete: 'CASCADE',
  })
  children: Category[];

  @OneToMany(() => Products, (product) => product.category, {
    cascade: ['remove'], // Tự động xóa sản phẩm khi xóa danh mục
    onDelete: 'CASCADE',
  })
  product: Products[];

  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
