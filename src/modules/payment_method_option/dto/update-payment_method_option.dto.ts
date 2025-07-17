import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentMethodOptionDto } from './create-payment_method_option.dto';

export class UpdatePaymentMethodOptionDto extends PartialType(
  CreatePaymentMethodOptionDto,
) {}
