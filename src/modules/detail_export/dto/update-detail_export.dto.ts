import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailExportDto } from './create-detail_export.dto';

export class UpdateDetailExportDto extends PartialType(CreateDetailExportDto) {}
