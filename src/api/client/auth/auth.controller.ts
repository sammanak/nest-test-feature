import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthBody, CustomerAuthBody, RegenerateRefreshTokenBody } from './auth.dto';
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

  @Post('/login/google')
  async loginWithGoogle(@Body() body: CustomerAuthBody) {
    const tokenSet = await this.service.loginWithGoogle(body.accessToken);
    return { data: tokenSet };
  }

  @Post('/login/facebook')
  async loginWithFacebook(@Body() body: CustomerAuthBody) {
    const tokenSet = await this.service.loginWithFacebook(body.accessToken);
    return { data: tokenSet };
  }

  @Post('/login/apple')
  async loginWithApple(@Body() body: CustomerAuthBody) {
    const tokenSet = await this.service.loginWithApple(body.accessToken);
    return { data: tokenSet };
  }
}
