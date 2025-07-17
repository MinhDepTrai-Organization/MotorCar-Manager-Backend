import { extend } from 'dayjs';

import { Base } from 'src/modules/Base/entities/Base.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Permission')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  module: string;

  @ManyToMany(() => Role, (element) => element.permissions)
  roles: Role[];

  @ManyToMany(() => User, (element) => element.permissions)
  @JoinTable({
    name: 'users_have_permisions',
    joinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @CreateDateColumn()
  createdat: Date;

  @UpdateDateColumn()
  updatedat: Date;

  @DeleteDateColumn()
  deletedat: Date;
}
