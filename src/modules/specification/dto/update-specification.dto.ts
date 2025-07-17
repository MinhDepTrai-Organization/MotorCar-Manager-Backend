import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecificationDto } from './create-specification.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSpecificationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  productId?: number; // Nếu cần cập nhật liên kết sản phẩm
}
