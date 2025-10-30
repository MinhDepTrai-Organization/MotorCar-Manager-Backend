import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import mailerConfig from 'src/config/mailer.config';

@Injectable()
export class CustomMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailFunc({
    to,
    subject,
    template,
    context,
  }: ISendMailOptions): Promise<{ success: boolean; message: string }> {
    try {
      const response: SentMessageInfo = await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });

      if (response?.accepted && response?.accepted?.length > 0) {
        console.log('✅ Gửi mail thành công:');
        return { success: true, message: 'Gửi mail thành công' };
      } else {
        console.warn('⚠️ Gửi mail thất bại:', response);
        return { success: false, message: 'Email bị từ chối' };
      }
    } catch (error) {
      console.error('❌ Lỗi khi gửi mail:', error);
      return { success: false, message: 'Lỗi từ server' };
    }
  }
}
