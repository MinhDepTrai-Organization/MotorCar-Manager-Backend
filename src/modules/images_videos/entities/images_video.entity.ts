import { Base } from 'src/modules/Base/entities/Base.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity('ImagesVideo')
export class ImagesVideo extends Base {
  @Column({ type: 'text' })
  UrlImage: string;

  @Column({ type: 'text' })
  type: string;

  @ManyToOne(() => Review, (review) => review.images_videos, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: false, // Tránh vòng lặp
  })
  reviews: Review;
}
