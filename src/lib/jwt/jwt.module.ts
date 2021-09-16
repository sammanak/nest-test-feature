import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule as _JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    _JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET')
        };
      }
    })
  ],
  exports: [_JwtModule]
})
export class JwtModule {}
