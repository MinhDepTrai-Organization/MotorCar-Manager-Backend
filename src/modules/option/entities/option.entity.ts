import { OptionValue } from 'src/modules/option_value/entities/option_value.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('option')
export class Option {
  @PrimaryGeneratedColumn('uuid') // Sử dụng 'uuid' để tạo ID tự động
  id: string;
  @Column()
  name: string;

  @OneToMany((type) => OptionValue, (optionvalue) => optionvalue.option)
  optionValues: OptionValue[];
}
