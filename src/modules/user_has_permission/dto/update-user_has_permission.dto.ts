import { PartialType } from '@nestjs/mapped-types';
import { CreateUserHasPermissionDto } from './create-user_has_permission.dto';

export class UpdateUserHasPermissionDto extends PartialType(CreateUserHasPermissionDto) {}
