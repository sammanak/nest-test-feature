import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { ClientAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ClientAuthGuard]
})
export class AuthModule {}
