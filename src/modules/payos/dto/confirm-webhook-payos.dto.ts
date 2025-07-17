import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export default class ConfirmWebhookPayOsDto {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({
    description: 'URL webhook để xác nhận giao dịch từ PayOs',
    example: 'https://your-server.com/webhook-url',
    required: true,
    type: String,
    format: 'uri',
  })
  webhookUrl: string;
}
