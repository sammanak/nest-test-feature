import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SendOtpBody } from './otp.dto';
import { OtpService } from './otp.service';

@ApiTags('OTP')
@Controller('client/otp')
export class OtpController {
  constructor(private readonly service: OtpService) {}

  @Post('send')
  @ApiOperation({ summary: 'send otp to email/phone for verify account or forgot password' })
  sendOtpToMailOrPhone(@Body() body: SendOtpBody) {
    return this.service.sendOtpToMailOrPhone(body);
  }
}
