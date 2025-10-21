import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class CustomMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailFunc({
    to,
    from = 'noreply@nestjs.com',
    subject,
    template,
    context,
  }: {
    to?: ISendMailOptions['to'];
    from?: ISendMailOptions['from'];
    subject?: ISendMailOptions['subject'];
    template?: ISendMailOptions['template'];
    context?: ISendMailOptions['context'];
  }) {
    try {
      const response: SentMessageInfo = await this.mailerService.sendMail({
        to,
        from,
        subject,
        template,
        context,
      });

      if (response?.accepted && response?.accepted?.length > 0) {
        console.log('✅ Gửi mail thành công:');
        return { success: 200, message: 'Gửi mail thành công' };
      } else {
        console.warn('⚠️ Gửi mail thất bại:', response);
        return { success: 400, message: 'Email bị từ chối' };
      }
    } catch (error) {
      console.error('❌ Lỗi khi gửi mail:', error);
      return { success: 400, message: 'Lỗi từ server' };
    }
  }
}
