import { Global, HttpModule, Module } from '@nestjs/common';

import { SmsService } from './sms.service';
import { TwilioSmsService } from './twilio.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [SmsService, TwilioSmsService],
  exports: [SmsService, TwilioSmsService]
})
export class SmsModule {}
