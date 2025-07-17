import { Base } from 'src/modules/Base/entities/Base.entity';
import { Voucher } from 'src/modules/vourchers/entities/vourcher.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TypeVoucher')
export class TypeVoucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name_type_voucher: string;

  @OneToMany(() => Voucher, (voucher) => voucher.type_voucher, {
    cascade: true, // Tự động lưu/xóa các voucher liên quan
    onDelete: 'CASCADE', // Xóa các voucher khi type_voucher bị xóa
  })
  vouchers: Voucher[];
}
