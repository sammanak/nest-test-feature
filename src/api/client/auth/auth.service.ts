import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { isEmail, isPhoneNumber } from 'class-validator';
import { BaseRepository } from 'src/repositories/base.repository';
import { EntityManager } from 'typeorm';

import { E } from '@common';
import { AccountEntity } from '@entities';

import { AuthBody } from './auth.dto';
import { JWTPayload, UserPayload } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountEntity)
    private account: BaseRepository<AccountEntity>,
    private em: EntityManager,
    private jwtService: JwtService
  ) {}

  async loginWithEmailOrPhone(body: AuthBody) {
    return this.em.transaction(async em => {
      const { phoneOrEmail, password } = body;
      const accountType = E.AccountTypeEnum.customer;
      const where = { type: accountType };
      if (isPhoneNumber(phoneOrEmail)) {
        Object.assign(where, { phone: phoneOrEmail });
      } else if (isEmail(phoneOrEmail)) {
        Object.assign(where, { email: phoneOrEmail });
      } else {
        throw new BadRequestException('phoneOrEmail must be email or phone number');
      }

      const account = await em.getRepository(AccountEntity).findOne(where);
      if (!account) throw new BadRequestException({ statusCode: 1111, message: 'Account not yet register' });
      if (account.status !== E.StatusEnum.active)
        throw new BadRequestException({ statusCode: 1110, message: 'Account is deactivated' });
      if (!account.isVerified)
        throw new ConflictException({ statusCode: 1112, message: 'Account already registered, but not yet verify' });

      const isMatch = await bcrypt.compare(password, account.password || '');
      if (!isMatch) throw new BadRequestException({ statusCode: 1120, message: 'Wrong credential' });

      const { id, type } = account;
      return {
        access_token: this.jwtService.sign({ id, type }, { expiresIn: process.env.JWT_TOKEN_EXPIRES || '1d' }),
        refresh_token: await this.getRefreshToken({ id, type })
      };
    });
  }

  async getRefreshToken(payload: any): Promise<any> {
    const options = {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES || '30d'
    };
    return this.jwtService.sign(payload, options);
  }

  async regenerateTokens(refresh: string): Promise<any> {
    const options = { secret: process.env.JWT_REFRESH_SECRET };
    try {
      if (await this.jwtService.verify(refresh, options)) {
        // if the refreshToken is valid
        const { id, type } = this.jwtService.decode(refresh) as JWTPayload;
        const newUnsignedPayload = { id, type };
        return {
          access_token: this.jwtService.sign(newUnsignedPayload, { expiresIn: process.env.JWT_TOKEN_EXPIRES || '1d' }),
          refresh_token: await this.getRefreshToken(newUnsignedPayload)
        };
      }
    } catch (e) {
      throw new UnauthorizedException(e.name);
    }
  }

  async loginWithGoogle(token: string) {
    return this.em.transaction(async em => {
      const decoded = this.jwtService.decode(token) as UserPayload;
      const user = await em.getRepository(AccountEntity).findOne({
        where: { providerId: decoded.sub }
      });
      if (!user) {
        const account = await em.getRepository(AccountEntity).save({
          email: decoded.email,
          type: E.AccountTypeEnum.customer,
          password: null,
          provider: E.AccountProviderEnum.google,
          isVerified: true,
          providerId: decoded.sub
        });
        const { id, type } = account;
        return {
          access_token: this.jwtService.sign({ id, type }, { expiresIn: process.env.JWT_TOKEN_EXPIRES || '1d' }),
          refresh_token: await this.getRefreshToken({ id, type })
        };
      } else {
        const { id, type } = user;
        return {
          access_token: this.jwtService.sign({ id, type }, { expiresIn: process.env.JWT_TOKEN_EXPIRES || '1d' }),
          refresh_token: await this.getRefreshToken({ id, type })
        };
      }
    });
  }

  async loginWithFacebook(token: string) {
    return this.em.transaction(async em => {
      const decoded = await axios({
        url: process.env.USER_DATA_FETCH_URL,
        method: 'GET',
        params: {
          fields: ['id', 'email', 'name'].join(','),
          access_token: token
        }
      });

      const user = await em.getRepository(AccountEntity).findOne({
        where: { providerId: decoded.data.id }
      });
      if (!user) {
        const account = await em.getRepository(AccountEntity).save({
          email: decoded.data.email || '',
          type: E.AccountTypeEnum.customer,
          password: null,
          provider: E.AccountProviderEnum.facebook,
          isVerified: true,
          providerId: decoded.data.id
        });
        const { id, type } = account;
        return {
          access_token: this.jwtService.sign({ id, type }, { expiresIn: process.env.JWT_TOKEN_EXPIRES || '1d' }),
          refresh_token: await this.getRefreshToken({ id, type })
        };
      } else {
        const { id, type } = user;
        return {
          access_token: this.jwtService.sign({ id, type }, { expiresIn: process.env.JWT_TOKEN_EXPIRES || '1d' }),
          refresh_token: await this.getRefreshToken({ id, type })
        };
      }
    });
  }

  async loginWithApple(token: string) {
    return this.em.transaction(async em => {
      const decoded = this.jwtService.decode(token) as UserPayload;

      const user = await em.getRepository(AccountEntity).findOne({
        where: { providerId: decoded.sub }
      });
      if (!user) {
        const accountPayload = {
          email: decoded.email,
          type: E.AccountTypeEnum.customer,
          password: null,
          provider: E.AccountProviderEnum.apple,
          isVerified: true,
          providerId: decoded.sub
        };
        const account = await em.getRepository(AccountEntity).save(accountPayload);
        const { id, type } = account;
        return {
          access_token: this.jwtService.sign({ id, type }, { expiresIn: process.env.JWT_TOKEN_EXPIRES || '1d' }),
          refresh_token: await this.getRefreshToken({ id, type })
        };
      } else {
        const { id, type } = user;
        return {
          access_token: this.jwtService.sign({ id, type }, { expiresIn: process.env.JWT_TOKEN_EXPIRES || '1d' }),
          refresh_token: await this.getRefreshToken({ id, type })
        };
      }
    });
  }
}
