import { Global, Module } from '@nestjs/common';
import { ConfigModule as _ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [_ConfigModule.forRoot({})],
  exports: [_ConfigModule]
})
export class ConfigModule {}
