import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { isEmail, isPhoneNumber } from 'class-validator';
import { EntityManager, Repository } from 'typeorm';

import { E } from '@common';
import { AccountEntity, AccountOtpEntity } from '@entities';

import { RegisterBody, UpdateInfoBody, VerifyAccountBody, VerifyForgotPasswordBody } from './account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private account: Repository<AccountEntity>,
    private readonly em: EntityManager
  ) {}

  async register(body: RegisterBody) {
    const { phoneOrEmail, password } = body;

    const type = E.AccountTypeEnum.customer;
    // register with default 'ecommerce' provider
    body['provider'] = E.AccountProviderEnum.ecommerce;
    body['type'] = type;
    body['isVerified'] = false;
    body['status'] = E.StatusEnum.active;

    const where = [{ type }];

    if (isPhoneNumber(phoneOrEmail)) {
      where[0]['phone'] = phoneOrEmail;
      body['phone'] = phoneOrEmail;
    } else if (isEmail(phoneOrEmail)) {
      where[0]['email'] = phoneOrEmail;
      body['email'] = phoneOrEmail;
    } else {
      throw new BadRequestException('phoneOrEmail must be email or phone number');
    }

    // check account exist or not
    const account = await this.account.findOne({ where });
    if (account) {
      if (!account.isVerified)
        throw new ConflictException({ statusCode: 1112, message: 'Account already registered, but not yet verify' });
      else if (account.isVerified)
        throw new ConflictException({ statusCode: 1111, message: 'Account already registered and verified' });
      else if (account.status === E.StatusEnum.inactive)
        throw new ConflictException({ statusCode: 1110, message: 'Account is deactivated' });
    }

    return this.em.transaction(async em => {
      try {
        body['password'] = await bcrypt.hash(password, 10);
        await em.getRepository(AccountEntity).save(body);
      } catch (e) {
        console.log(e);
        if (e.code === 'ER_DUP_ENTRY')
          throw new ConflictException({ statusCode: 1111, message: 'Account already registered and verified' });
        throw new InternalServerErrorException();
      }

      return { message: 'ok' };
    });
  }

  async detail(authUser: any) {
    const { id } = authUser;
    const customer = await this.account.findOne({
      where: { id: +id || null },
      select: ['id', 'firstName', 'providerId', 'lastName', 'gender', 'email', 'phone', 'profilePicture', 'createdAt']
    });
    if (!customer) throw new NotFoundException({ statusCode: 1114, message: 'Account not yet register' });

    // Result
    return { data: customer };
  }

  async update(id: number, body: UpdateInfoBody) {
    const account = await this.account.findOne({ id, status: E.StatusEnum.active });
    if (!account) throw new NotFoundException({ statusCode: 1114, message: 'Account not yet registered' });
    if (!account.isVerified) {
      throw new ConflictException({ statusCode: 1112, message: 'Account already registered, but not yet verify' });
    } else if (account.status !== E.StatusEnum.active) {
      throw new BadRequestException({ statusCode: 1110, message: 'Account is deactivated' });
    }

    Object.assign(account, body);
    await this.account.save(account);
    return { message: 'ok' };
  }

  async verifyAccount(body: VerifyAccountBody) {
    return this.em.transaction(async em => {
      const { phoneOrEmail, otp } = body;
      const otpType = E.OtpVerifyTypeEnum.accountVerification;
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
      const account = await em.getRepository(AccountEntity).findOne(where);
      if (!account) throw new BadRequestException({ statusCode: 1114, message: 'Account not yet register' });
      if (account.isVerified)
        throw new ConflictException({ statusCode: 1111, message: 'Account already registered and verified' });

      // check otp exist or not
      const accountOtpWhere = { accountId: account.id, type: otpType };
      const accountOtp = await em.getRepository(AccountOtpEntity).findOne(accountOtpWhere);
      if (!accountOtp) throw new BadRequestException({ statusCode: 1131, message: 'Otp mismatched' });

      // verify account
      const currentTimestamp = new Date().getTime();
      const expireTimestamp = accountOtp.expiredAt.getTime();

      if (currentTimestamp > expireTimestamp)
        throw new BadRequestException({ statusCode: 1130, message: 'Otp expired' });
      if (otp === accountOtp.code && phoneOrEmail === accountOtp.value) {
        await em.getRepository(AccountOtpEntity).delete({ accountId: account.id, type: otpType });
        account['isVerified'] = true;
        await em.getRepository(AccountEntity).save(account);
        return { message: 'ok' };
      }
      throw new BadRequestException({ statusCode: 1131, message: 'Otp mismatched' });
    });
  }

  async verifyForgotPassword(body: VerifyForgotPasswordBody) {
    return this.em.transaction(async em => {
      const { phoneOrEmail, otp } = body;
      const otpType = E.OtpVerifyTypeEnum.forgetPassword;
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
      const account = await em.getRepository(AccountEntity).findOne(where);
      if (!account) throw new BadRequestException({ statusCode: 1114, message: 'Account not yet register' });
      if (account.status !== E.StatusEnum.active) {
        throw new BadRequestException({ statusCode: 1110, message: 'Account is deactivated' });
      } else if (!account.isVerified) {
        throw new ConflictException({ statusCode: 1112, message: 'Account registered, but not yet verify' });
      }

      // check otp exist or not
      const accountOtpWhere = { accountId: account.id, type: otpType };
      const accountOtp = await em.getRepository(AccountOtpEntity).findOne(accountOtpWhere);
      if (!accountOtp) throw new BadRequestException({ statusCode: 1131, message: 'Otp mismatched' });

      // set new password to account
      const currentTimestamp = new Date().getTime();
      const expireTimestamp = accountOtp.expiredAt.getTime();

      if (currentTimestamp > expireTimestamp) {
        throw new BadRequestException({ statusCode: 1130, message: 'Otp expired' });
      } else if (otp === accountOtp.code && phoneOrEmail === accountOtp.value) {
        await em.getRepository(AccountOtpEntity).delete({ accountId: account.id, type: otpType });
        account['password'] = await bcrypt.hash(body.newPassword, 10);
        await em.getRepository(AccountEntity).save(account);
        return { message: 'ok' };
      }
      throw new BadRequestException({ statusCode: 1131, message: 'Otp mismatched' });
    });
  }
}
