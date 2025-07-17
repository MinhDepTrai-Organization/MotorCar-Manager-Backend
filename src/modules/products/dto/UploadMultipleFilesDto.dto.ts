import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class UploadMultipleFilesDto {
  @ApiProperty({
    description: 'List of avatar images',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    example: ['avatar1.jpg', 'avatar2.jpg'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  files?: Express.Multer.File[];

  @ApiProperty({
    description: 'List of background images',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    example: ['background1.jpg'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  backgrounds?: Express.Multer.File[];

  @ApiProperty({
    description: 'Folder name to save the files',
    example: 'Products/',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  folder?: string;
}
