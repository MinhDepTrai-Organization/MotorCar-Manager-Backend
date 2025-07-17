import { PartialType } from '@nestjs/mapped-types';
import { CreateZaloPaymentDto } from './create-zalo-payment.dto';

export class UpdateZaloPaymentDto extends PartialType(CreateZaloPaymentDto) {}
