import { Base } from 'src/modules/Base/entities/Base.entity';
import { Conversation } from 'src/modules/conversation/entities/conversation.entity';
import { Export } from 'src/modules/export/entities/export.entity';
import { Import } from 'src/modules/import/entities/import.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
@Entity()
export class User extends Base {
  @Column()
  username: string;

  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  age: number;
  @Column({ nullable: true })
  address: string;
  @Column({ nullable: true })
  phoneNumber: string;

  // Thêm trường giới tính
  @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'other' })
  gender: 'male' | 'female' | 'other';

  @Column({
    default:
      'https://res.cloudinary.com/diwacy6yr/image/upload/v1728441530/User/default.png',
  })
  avatarUrl: string;
  @Column({
    type: 'date',
    nullable: true,
  })
  birthday: Date;

  @Column({ default: false })
  isActice: boolean;

  @Column({
    nullable: true,
  })
  codeId: string;

  @Column({
    nullable: true,
  })
  codeExprided: Date;

  @OneToMany((type) => Import, (element) => element.user)
  import: Import[];
  @OneToMany(() => Conversation, (conversation) => conversation.admin)
  conversations: Conversation[];

  @OneToMany(() => Message, (message) => message.admin)
  messages: Message[];

  @OneToMany(() => Export, (element) => element.user)
  export: Export[];

  @ManyToMany(() => Role, (element) => element.users)
  Roles: Role[];
  @ManyToMany(() => Permission, (element) => element.users)
  permissions: Permission[];
}
