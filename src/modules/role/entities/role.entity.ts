import { RoleEnum } from 'src/constants/role.enum';
import { Base } from 'src/modules/Base/entities/Base.entity';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';

import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('role')
// export class Role extends Base {
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'enum',
    enum: RoleEnum,
    nullable: false,
    default: RoleEnum.USER,
    unique: true,
  })
  name: RoleEnum;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  isActive: boolean;

  @ManyToMany(() => Permission, (element) => element.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @ManyToMany(() => User, (element) => element.Roles, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'users_have_roles',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @OneToMany(() => Customer, (customer) => customer.Roles)
  customer: Customer[];
}
