import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtp(to: string, subject: string, body: string) {
    try {
      await this.mailerService.sendMail({
        to: to,
        from: '"' + process.env.MAIL_COMPANY_NAME + '" <' + process.env.MAIL_AUTH_USER + '>',
        // cc: ['mailer.cc@gmail.com'],
        subject: subject,
        html: body
        // text: body,
        // attachments: [
        //   { filename: 'mailer.png', path: 'mailer.png' }
        // ]
      });
    } catch (error) {
      console.log(error);
    }
  }
}
