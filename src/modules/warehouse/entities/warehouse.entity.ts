import { Branch } from 'src/modules/branch/entities/branch.entity';
import { DetailExport } from 'src/modules/detail_export/entities/detail_export.entity';
import { DetailImport } from 'src/modules/detail_import/entities/detail_import.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('warehouse')
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  address: string; // Địa điểm kho

  @Column({ type: 'text', nullable: true })
  description: string; // Mô tả thêm về kho

  // Mối quan hệ với DetailImport
  @OneToMany(() => DetailImport, (detailImport) => detailImport.warehouse, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  detail_imports: DetailImport[];

  @OneToMany(() => DetailExport, (element) => element.wareHouse)
  detail_export: DetailExport[];

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => Branch, (branch) => branch.wareHouses)
  branches: Branch[];
}
