import { Module } from '@nestjs/common';

import { AccountModule } from './account';
import { AuthModule } from './auth';
import { OtpModule } from './otp';
import { UploadModule } from './upload';

@Module({
  imports: [AuthModule, OtpModule, UploadModule, AccountModule]
})
export class ClientModule {}
