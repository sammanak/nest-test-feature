import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClientAuthGuard } from '../auth/auth.guard';
import { RegisterBody, UpdateInfoBody, VerifyAccountBody, VerifyForgotPasswordBody } from './account.dto';
import { AccountService } from './account.service';

@ApiTags('Accounts')
@Controller('client/account')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Post('register')
  @ApiOperation({ summary: 'register new customer account' })
  register(@Body() body: RegisterBody) {
    return this.service.register(body);
  }

  @Get('profile')
  @UseGuards(ClientAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get own profile general info' })
  detail(@Request() request) {
    const { authUser } = request;
    return this.service.detail(authUser);
  }

  @Put('profile')
  @UseGuards(ClientAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update own profile general info' })
  updateInfo(@Request() request, @Body() body: UpdateInfoBody) {
    const { authUser } = request;
    const id = authUser ? +authUser.id : null;
    return this.service.update(id, body);
  }

  @Post('verify-forgot-password')
  @ApiOperation({ summary: 'verify forgot password otp and reset password' })
  verifyForgotPassword(@Body() body: VerifyForgotPasswordBody) {
    return this.service.verifyForgotPassword(body);
  }

  @Post('verify-account')
  @ApiOperation({ summary: 'verify account' })
  verifyAccount(@Body() body: VerifyAccountBody) {
    return this.service.verifyAccount(body);
  }
}
