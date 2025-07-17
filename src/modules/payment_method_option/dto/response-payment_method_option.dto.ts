import { Expose, Transform } from 'class-transformer';
import { PaymentMethod } from 'src/modules/payment_method/entities/payment_method.entity';

export class ResponsePaymentMethodOptionDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  @Transform(({ obj }) => {
    if (obj.paymentMethod) {
      const { id, name, description } = obj.paymentMethod;
      return {
        id,
        name,
        description,
      };
    }
  })
  paymentMethod: PaymentMethod;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
