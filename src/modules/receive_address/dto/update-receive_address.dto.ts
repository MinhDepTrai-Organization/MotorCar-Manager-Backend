import { PartialType } from '@nestjs/swagger';
import { CreateReceiveAddressDto } from './create-receive_address.dto';

export class UpdateReceiveAddressDto extends PartialType(CreateReceiveAddressDto) {}
