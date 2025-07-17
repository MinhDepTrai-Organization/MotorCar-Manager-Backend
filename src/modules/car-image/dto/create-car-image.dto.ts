import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCarImageDto {
  @IsString()
  @IsOptional()
  id?: number;

  @IsUrl()
  imageUrl: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  count?: number;
  // You can also add additional validation rules if necessary
  // If 'car' is to be represented as an ID only
  @IsOptional()
  carId?: number;
}
