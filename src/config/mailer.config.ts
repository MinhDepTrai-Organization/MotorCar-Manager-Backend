import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { registerAs } from '@nestjs/config';
import { join } from 'path';

export default registerAs(
  'mailConfig',
  (): MailerOptions => ({
    transport: {
      host: process.env.EMAILHOST,
      secure: false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
      },
      tls: {
        rejectUnauthorized: false, // Bỏ qua xác thực TLS
      },
    },

    preview: false,
    template: {
      dir: join(__dirname, '..', '..', 'src', 'modules', 'mail', 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
);
