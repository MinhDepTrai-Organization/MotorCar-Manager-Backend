import { PartialType } from '@nestjs/mapped-types';
import { CreateOptionValueDto } from './create-option_value.dto';

export class UpdateOptionValueDto extends PartialType(CreateOptionValueDto) {}
