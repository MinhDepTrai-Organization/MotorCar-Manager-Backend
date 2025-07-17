import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Base } from 'src/modules/Base/entities/Base.entity';
import { Warehouse } from 'src/modules/warehouse/entities/warehouse.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';

@Entity('branch')
export class Branch extends Base {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true }) // Cho phép giá trị null trong database
  @IsOptional()
  @IsString()
  managername: string;

  @Column()
  @IsString()
  logo: string;
  @Column({ default: true })
  @IsBoolean()
  active: boolean;
  @ManyToMany(() => Warehouse, (warehouse) => warehouse.branches, {
    cascade: true, // Tự động cascade khi thêm/xóa
    onDelete: 'CASCADE', // Xóa dữ liệu trong bảng trung gian khi chi nhánh bị xóa
    onUpdate: 'CASCADE', // Cập nhật dữ liệu trong bảng trung gian khi có thay đổi
  })
  @JoinTable({
    name: 'branch_warehouses', // Tên bảng trung gian
    joinColumn: { name: 'branch_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'warehouse_id', referencedColumnName: 'id' },
  })
  wareHouses: Warehouse[];
}
