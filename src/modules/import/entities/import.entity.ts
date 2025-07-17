import { DetailImport } from 'src/modules/detail_import/entities/detail_import.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('import')
export class Import {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => User, (element) => element.import)
  @JoinColumn({ name: 'user_id' }) // Thêm khóa ngoại cho user
  user: User;
  
  @OneToMany(() => DetailImport, (detailImport) => detailImport.import)
  detail_imports: DetailImport[]; // Một Import có nhiều DetailImport
  // Cột createdAt tự động lưu thời gian khi tạo bản ghi
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true })
  note?: string;
  // Cột createdAt tự động lưu thời gian khi tạo bản ghi
  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
