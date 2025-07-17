import { Base } from 'src/modules/Base/entities/Base.entity';
import { DetailImport } from 'src/modules/detail_import/entities/detail_import.entity';
import { Export } from 'src/modules/export/entities/export.entity';
import { Skus } from 'src/modules/skus/entities/skus.entity';
import { Warehouse } from 'src/modules/warehouse/entities/warehouse.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Detail_export')
export class DetailExport {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'int' })
  quantity_export: number;
  @ManyToOne(() => Export, (element) => element.detail_export, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'export_id' })
  export: Export;

  @ManyToOne(() => DetailImport, (element) => element.detail_export, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'detail_import_id' })
  detail_import: DetailImport;

  @ManyToOne(() => Skus, (element) => element.detail_export, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skus_id' })
  skus: Skus;

  @ManyToOne(() => Warehouse, (element) => element.detail_export, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  wareHouse: Warehouse;
}
