import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from 'src/constants/role.enum';

export const ROLE = 'role';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLE, roles);
