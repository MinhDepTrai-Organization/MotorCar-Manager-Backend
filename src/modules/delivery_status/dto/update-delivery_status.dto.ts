import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryStatusDto } from './create-delivery_status.dto';

export class UpdateDeliveryStatusDto extends PartialType(CreateDeliveryStatusDto) {}
