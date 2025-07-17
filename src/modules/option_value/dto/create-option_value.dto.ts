import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateOptionValueDto {
  @ApiProperty({ example: 'Red', description: 'Giá trị của Option' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  value: string;

  @ApiProperty({
    example: '6208a20a-1246-43a4-8d59-4cb96dd5ebb8',
    description: 'ID của SKU liên kết',
  })
  @IsNotEmpty()
  @IsString()
  skusId: string;

  @ApiProperty({
    example: 'd47373e8-b36d-4bca-9a59-43ad5bcadbbb',
    description: 'ID của Option liên kết',
  })
  @IsNotEmpty()
  @IsString()
  optionId: string;

  @IsOptional()
  @IsString()
  productId: string;
}
