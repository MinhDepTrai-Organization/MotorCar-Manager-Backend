import { Option } from 'src/modules/option/entities/option.entity';
import { Skus } from 'src/modules/skus/entities/skus.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('option_value')
export class OptionValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255 }) // Thêm độ dài tối đa
  value: string;

  // option value
  @ManyToOne((type) => Option, (element) => element.optionValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: Option;
  /////////////// skus
  @ManyToOne((type) => Skus, (element) => element.optionValue, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skus_id' })
  skus: Skus;
}
