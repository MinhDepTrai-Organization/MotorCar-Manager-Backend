import { Base } from 'src/modules/Base/entities/Base.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('blog_categories')
export class BlogCategory extends Base {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Blog, (blog) => blog.blogCategory)
  blogs: Blog[];
}
