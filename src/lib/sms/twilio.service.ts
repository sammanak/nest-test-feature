import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioSmsService {
  async sendSmd(phone: string, body: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    const client = new Twilio(accountSid, authToken);

    client.messages.create({
      from: twilioNumber,
      to: phone,
      body: body
    });
  }
}
