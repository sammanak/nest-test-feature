import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthBody, RegenerateRefreshTokenBody } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentications')
@Controller('client/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'customer authenticate with phone/email' })
  async loginWithEmailOrPhone(@Body() body: AuthBody) {
    const tokenSet = await this.service.loginWithEmailOrPhone(body);
    return { data: tokenSet };
  }

  @Post('/refresh-token')
  @ApiOperation({ summary: 'regenerate refresh token' })
  async regenerateRefreshToken(@Body() body: RegenerateRefreshTokenBody) {
    const newTokenSet = await this.service.regenerateTokens(body.refreshToken);
    return { data: newTokenSet };
  }
}
