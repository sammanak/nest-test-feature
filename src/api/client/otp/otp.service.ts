import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { EntityManager } from 'typeorm';

import { E } from '@common';
import { AccountEntity, AccountOtpEntity } from '@entities';
import { MailService } from '@lib/mail/mailer.service';
import { SmsService } from '@lib/sms/sms.service';

import { SendOtpBody } from './otp.dto';

@Injectable()
export class OtpService {
  constructor(
    private readonly em: EntityManager,
    private readonly mailService: MailService,
    private readonly smsService: SmsService
  ) {}

  getRandomArbitrary(min, max): string {
    return parseInt(Math.random() * (max - min) + min).toString();
  }

  async sendOtpToMailOrPhone(body: SendOtpBody) {
    return this.em.transaction(async em => {
      const { phoneOrEmail, hashCode } = body;
      const otpType = body.type;
      const accountType = E.AccountTypeEnum.customer;

      // validate phoneOrEmail
      const where = { type: accountType };
      if (isPhoneNumber(phoneOrEmail)) {
        Object.assign(where, { phone: phoneOrEmail });
      } else if (isEmail(phoneOrEmail)) {
        Object.assign(where, { email: phoneOrEmail });
      } else {
        throw new BadRequestException('phoneOrEmail must be email or phone number');
      }

      // check account exist or not
      const account = await em.getRepository(AccountEntity).findOne({ where });
      if (!account) throw new BadRequestException('Account not exist');

      // check account already verified if type = ACCOUNT_VERIFICATION
      if (otpType === E.OtpVerifyTypeEnum.accountVerification && account.isVerified)
        throw new ConflictException('Account already verified');

      const randomCode: string = this.getRandomArbitrary(100000, 999999).toString();
      const expireSecond = parseInt(process.env.OTP_EXPIRES_MILLISECOND) || 1 * 60 * 1000;
      const currentDate = new Date();
      const addMinuteDate = new Date(currentDate.getTime() + expireSecond);

      const accountOtpPayload = {
        accountId: account.id,
        type: otpType,
        code: randomCode,
        value: phoneOrEmail,
        createdAt: currentDate,
        expiredAt: addMinuteDate
      };

      await em.getRepository(AccountOtpEntity).delete({ accountId: account.id, type: otpType });
      await em.getRepository(AccountOtpEntity).save(accountOtpPayload);

      // check is email or phone to send otp
      if (isPhoneNumber(phoneOrEmail)) {
        // send otp to phone
        const smsOtpBody: string = '<#> Code: ' + randomCode + ' ' + hashCode;
        await this.smsService.sendSms(phoneOrEmail, smsOtpBody);
      } else if (isEmail(phoneOrEmail)) {
        // send otp to email
        const mailSubject = otpType.replace('_', ' ');
        const mailOtpBody: string =
          '<p>Please do not share this OTP with anyone.<br><#> Code: <b style="font-size: 1.2em;">' +
          randomCode +
          '<b></p>';
        await this.mailService.sendOtp(phoneOrEmail, mailSubject, mailOtpBody);
      } else {
        throw new BadRequestException('phoneOrEmail must be email or phone number');
      }

      return {
        message: 'ok'
      };
    });
  }
}
