import { PartialType } from '@nestjs/swagger';
import { CreateOrderPaymentMethodOptionDto } from './create-order_payment_method_option.dto';

export class UpdateOrderPaymentMethodOptionDto extends PartialType(CreateOrderPaymentMethodOptionDto) {}
