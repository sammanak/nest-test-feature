import { Module } from '@nestjs/common';

import { ClientModule } from '@api/client/client.module';
import { ConfigModule } from '@lib/config';
import { JwtModule } from '@lib/jwt';
import { MailModule } from '@lib/mail';
import { SmsModule } from '@lib/sms';
import { TypeOrmModule } from '@lib/typeorm';

@Module({
  imports: [TypeOrmModule, ClientModule, ConfigModule, JwtModule, MailModule, SmsModule]
})
export class AppModule {}
