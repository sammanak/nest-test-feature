import { BadRequestException, Injectable } from '@nestjs/common';

import { TwilioSmsService } from './twilio.service';

@Injectable()
export class SmsService {
  constructor(private readonly twilio: TwilioSmsService) {}

  async sendSms(phone: string, text: string) {
    // check sms provider config from env Enum[TWILIO]
    const smsProvider = process.env.SMS_PROVIDER || '';
    switch (smsProvider) {
      case 'TWILIO':
        return await this.twilio.sendSmd(phone, text);
      default:
        throw new BadRequestException('Invalid sms provider');
    }
  }
}
