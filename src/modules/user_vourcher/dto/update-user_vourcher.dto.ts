import { PartialType } from '@nestjs/mapped-types';
import { CreateUserVourcherDto } from './create-user_vourcher.dto';

export class UpdateUserVourcherDto extends PartialType(CreateUserVourcherDto) {}
