import { ApiProperty } from '@nestjs/swagger';
import { DetailExport } from 'src/modules/detail_export/entities/detail_export.entity';
import { Import } from 'src/modules/import/entities/import.entity';
import { Skus } from 'src/modules/skus/entities/skus.entity';
import { Warehouse } from 'src/modules/warehouse/entities/warehouse.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('detail_import')
export class DetailImport {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    name: 'id',
    type: String,
    description: 'ID của chi tiết nhập hàng',
    required: true,
    uniqueItems: true,
    example: '387b1738-5734-427a-a217-82395122fc5f',
  })
  id: string;

  @Column('decimal') // Giá nhập có thể có số lẻ
  @ApiProperty({
    name: 'price_import',
    type: Number,
    description: 'Giá nhập của sản phẩm',
    required: true,
    example: 100000,
  })
  price_import: number;

  @Column('int')
  @ApiProperty({
    name: 'quantity_import',
    type: Number,
    description: 'Số lượng nhập',
    required: true,
    example: 100,
  })
  quantity_import: number;

  @Column('int', { default: 0 })
  @ApiProperty({
    name: 'quantity_sold',
    type: Number,
    description: 'Số lượng đã bán',
    required: true,
    example: 0,
  })
  quantity_sold: number;

  @Column('varchar', { nullable: false })
  @Index('UQ_warehouse_lot_skus', ['warehouse_id', 'lot_name', 'skus_id'], {
    unique: true,
  })
  @ApiProperty({
    name: 'lot_name',
    type: String,
    description: 'Tên lô hàng',
    required: false,
    example: 'Lô hàng 1',
  })
  lot_name: string;

  @Column('int', { default: 0 })
  @ApiProperty({
    name: 'quantity_remaining',
    type: Number,
    description: 'Số lượng còn lại',
    required: true,
    example: 100,
  })
  quantity_remaining: number;

  @ManyToOne(() => Import, (importEntity) => importEntity.detail_imports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'import_id' })
  import: Import;

  @ManyToOne(() => Skus, (element) => element.detail_import, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skus_id' })
  skus: Skus;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.detail_imports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @OneToMany(() => DetailExport, (element) => element.detail_import)
  detail_export: DetailExport[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @ApiProperty({
    name: 'deleted_at',
    type: Date,
    description: 'Thời gian xóa',
    required: false,
    example: '2021-08-02T09:00:00Z',
  })
  deleted_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty({
    name: 'created_at',
    type: Date,
    description: 'Thời gian tạo',
    required: true,
    example: '2021-08-01T09:00:00Z',
  })
  created_at: Date;
}
