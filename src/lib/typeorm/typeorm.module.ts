import { Global, Module } from '@nestjs/common';
import { TypeOrmModule as _TypeOrmModule } from '@nestjs/typeorm';

import * as Entities from '@entities';
import * as Repositories from '@repositories';

import { TypeOrmConfigService } from './typeorm.service';

@Global()
@Module({
  imports: [
    _TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    _TypeOrmModule.forFeature([...Object.values(Entities), ...Object.values(Repositories)])
  ],
  exports: [_TypeOrmModule]
})
export class TypeOrmModule {}
