import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeVoucherDto } from './create-type_voucher.dto';

export class UpdateTypeVoucherDto extends PartialType(CreateTypeVoucherDto) {}
