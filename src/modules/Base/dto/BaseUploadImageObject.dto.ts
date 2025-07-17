import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BaseUploadImageObjectDto {
  @ApiProperty({
    name: 'public_id',
    description: 'Public id of the image',
    example: 'Product/ebfe9f427f4a6787ea00e00da9e67f9e',
  })
  @IsString()
  @IsNotEmpty()
  public_id: string;

  @ApiProperty({
    name: 'url',
    description: 'Url of the image',
    example:
      'http://res.cloudinary.com/dk9b7v7vz/image/upload/v1626792078/Product/ebfe9f427f4a6787ea00e00da9e67f9e.jpg',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    name: 'secure_url',
    description: 'Secure url of the image',
    example:
      'https://res.cloudinary.com/dk9b7v7vz/image/upload/v1626792078/Product/ebfe9f427f4a6787ea00e00da9e67f9e.jpg',
  })
  @IsOptional()
  @IsString()
  secure_url?: string;
}
