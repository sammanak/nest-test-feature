import { EntityRepository } from 'typeorm';

import { AccountEntity } from '@entities';

import { BaseRepository } from './base.repository';

@EntityRepository(AccountEntity)
export class AccountRepository extends BaseRepository<AccountEntity> {
  async $find(limit: number, offset: number) {
    return this.$rawSql('SELECT * FROM Accounts LIMIT :limit OFFSET :offset', { limit, offset });
  }
}
