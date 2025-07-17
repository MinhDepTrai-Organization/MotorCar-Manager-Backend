import { ApiProperty } from '@nestjs/swagger';
import { Enum } from '@solana/web3.js';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  IsUUID,
} from 'class-validator';
import { RoleEnum } from 'src/constants/role.enum';

export class CreateRoleDto {
  @ApiProperty({
    name: 'name',
    example: RoleEnum.ADMIN,
    enum: RoleEnum,
    type: Enum,
  })
  @IsEnum(RoleEnum)
  name: RoleEnum;

  @ApiProperty({
    name: 'description',
    example: 'Admin thì full quyền',
  })
  @IsString()
  description: string;

  @ApiProperty({
    name: 'isActive',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    name: 'permissions',
    example: ['3f45af7a-a83c-41f2-930b-d8719aa85137'],
    description: 'Danh sách ID của các quyền',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  permissions: string[];
}
