import { Base } from 'src/modules/Base/entities/Base.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { ImagesVideo } from 'src/modules/images_videos/entities/images_video.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Products } from 'src/modules/products/entities/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('review')
export class Review extends Base {
  @ManyToOne(() => Customer, (customer) => customer.reviews, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Products, (product) => product.reviews, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Products;

  @ManyToOne(() => Order, (order) => order.reviews, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'float', comment: 'đã mua mới đánh giá' })
  review_rating: number;

  @Column({ type: 'text', nullable: true })
  review_comment: string;

  @OneToMany(() => ImagesVideo, (imagesVideo) => imagesVideo.reviews)
  images_videos: ImagesVideo[];
}
