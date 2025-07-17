import { ApiProperty } from '@nestjs/swagger';

export class UploadImageReponseDto {
  @ApiProperty({ description: 'public id of image' })
  public_id: string;

  @ApiProperty({ description: 'public url of image' })
  url: string;
}
