import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { E } from '@common';
import { AccountRepository } from '@repositories';

import { JWTPayload } from './auth.interfaces';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(private readonly service: JwtService, private readonly account: AccountRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authToken = req.get('authorization') || '';
    const [scheme, token] = authToken.split(' ');

    const user = await this.checkUserScheme(scheme, token);
    (req as any).authUser = user;

    return true;
  }
  async checkUserScheme(scheme: string, token: string) {
    if (scheme.toLowerCase() !== 'bearer')
      throw new UnauthorizedException({ statusCode: 4403, message: 'Invalid Authorization Scheme' });
    if (!token) throw new UnauthorizedException({ statusCode: 4404, message: 'Authorization token is missing' });

    let decoded: JWTPayload;
    try {
      decoded = await this.service.verifyAsync<JWTPayload>(token);
    } catch (e) {
      if (e.name === 'JsonWebTokenError')
        throw new UnauthorizedException({ statusCode: 4400, message: 'Invalid json web token' });
      else if (e.name === 'TokenExpiredError')
        throw new UnauthorizedException({ statusCode: 4410, message: 'Token expired' });
      else throw new UnauthorizedException({ statusCode: 4401, message: 'Unauthorized' });
    }
    const account = await this.account.findOne({ id: decoded.id, type: E.AccountTypeEnum.customer });
    if (!account || (account && account.status !== E.StatusEnum.active)) throw new ForbiddenException();

    return account;
  }
}

@Injectable()
export class ClientAuthGuardOptional implements CanActivate {
  constructor(private readonly service: JwtService, private readonly account: AccountRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authToken = req.get('authorization') || '';
    if (authToken === '') {
      return true;
    } else {
      const [scheme, token] = authToken.split(' ');
      const user = await this.checkUserScheme(scheme, token);
      (req as any).authUser = user;
      return true;
    }
  }
  async checkUserScheme(scheme: string, token: string) {
    if (scheme.toLowerCase() !== 'bearer')
      throw new UnauthorizedException({ statusCode: 4403, message: 'Invalid Authorization Scheme' });
    if (!token) throw new UnauthorizedException({ statusCode: 4404, message: 'Authorization token is missing' });

    let decoded: JWTPayload;
    try {
      decoded = await this.service.verifyAsync<JWTPayload>(token);
    } catch (e) {
      if (e.name === 'JsonWebTokenError')
        throw new UnauthorizedException({ statusCode: 4400, message: 'Invalid json web token' });
      else if (e.name === 'TokenExpiredError')
        throw new UnauthorizedException({ statusCode: 4410, message: 'Token expired' });
      else throw new UnauthorizedException({ statusCode: 4401, message: 'Unauthorized' });
    }
    const account = await this.account.findOne(decoded.id);
    if (!account || (account && account.status !== E.StatusEnum.active)) throw new ForbiddenException();

    return account;
  }
}
