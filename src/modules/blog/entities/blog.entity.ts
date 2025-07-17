import { Base } from 'src/modules/Base/entities/Base.entity';
import { BlogCategory } from 'src/modules/blog-categories/entities/blog-category.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('blog')
export class Blog extends Base {
  @Column()
  title: string;

  @Column()
  thumbnail: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'simple-array',
    default: [],
  })
  blogImages: string[];

  @ManyToOne(() => BlogCategory, (blogCategory) => blogCategory.blogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogCategoryId' })
  blogCategory: BlogCategory;

  @ManyToOne(() => Customer, (customer) => customer.blogs, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'customerId' })
  customer?: Customer;

  @Column({ unique: true })
  slug: string;
}
