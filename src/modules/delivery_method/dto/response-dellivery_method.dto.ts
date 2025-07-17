import { Expose, Transform } from 'class-transformer';

export class ResponseDeliveryMethodDto {
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  description?: string;
  @Expose()
  fee: number;
  @Expose()
  logo?: string;
  @Expose()
  updatedAt: Date;
  @Expose()
  createdAt: Date;
  @Expose()
  deletedAt: Date | null;
}
