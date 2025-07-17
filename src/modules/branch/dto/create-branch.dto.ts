import { applyIsOptionalDecorator } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateWarehouseDto } from 'src/modules/warehouse/dto/create-warehouse.dto';

class Warehouse {
  @ApiProperty({
    example: '74f68f7c-a9a9-41ed-a5ec-132a93051abb',
    description: 'ID của kho hàng',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
export class CreateBranchDto {
  @ApiProperty({ example: 'Chi nhánh A', description: 'Tên của chi nhánh' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '123 Đường ABC, TP.HCM',
    description: 'Địa chỉ chi nhánh',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  // @ApiProperty({
  //   example: 'Nguyễn Văn A',
  //   description: 'Tên của người quản lý',
  // })
  // @IsOptional()
  // @IsString()
  // // @IsNotEmpty()
  // managername: string;

  @ApiPropertyOptional({
    example: 'logo.png',
    description: 'URL logo của chi nhánh',
  })
  @IsString()
  @IsOptional()
  logo: string;

  // @ApiPropertyOptional({
  //   example: true,
  //   description: 'URL logo của chi nhánh',
  // })
  // @IsOptional()
  // @IsBoolean()
  // active: boolean;

  @ApiPropertyOptional({
    type: [Warehouse],
    description: 'Danh sách các kho hàng liên kết với chi nhánh',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Warehouse)
  wareHouses: Warehouse[];
}
