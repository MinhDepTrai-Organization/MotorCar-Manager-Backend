import { Brand } from 'src/modules/brand/entities/brand.entity';
import { Category } from 'src/modules/category/entities/category.entity';

import { Specification } from 'src/modules/specification/entities/specification.entity';

import * as he from 'he';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Skus } from 'src/modules/skus/entities/skus.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import { ProductType } from 'src/constants';
import { Base } from 'src/modules/Base/entities/Base.entity';

@Entity('products')
export class Products extends Base {
  @Column({ type: 'varchar' })
  slug_product: string;
  @Column({ type: 'varchar' })
  title: string;

  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.CAR,
  })
  type: ProductType;
  @Column({ type: 'text', nullable: true })
  description: string;
  // Phương thức để mã hóa HTML entities khi lưu vào DB
  cleanAndEncodeDescription() {
    const encodedDescription = he.encode(this.description || '');
    return encodedDescription;
  }
  // Phương thức giải mã HTML entities khi lấy từ DB
  decodeDescription(encodedDescription: string) {
    return he.decode(encodedDescription);
  }

  @OneToMany(() => Specification, (specification) => specification.product)
  specifications: Specification[];

  @ManyToOne(() => Brand, (brand) => brand.productId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'text', array: true, nullable: true, default: null })
  images: string[];

  @OneToMany(() => Skus, (element) => element.product)
  skus: Skus[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];
}
