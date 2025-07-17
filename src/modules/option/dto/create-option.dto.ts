import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateOptionDto {
  @ApiProperty({ example: 'Kích thước', description: 'Tên thuộc tính' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
