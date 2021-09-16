import { ObjectLiteral, Repository } from 'typeorm';

import { ReadSQLFile } from '@lib/typeorm/typeorm.helper';

export class BaseRepository<T> extends Repository<T> {
  $rawSql(sql: string, params: ObjectLiteral) {
    const [q, p] = this.manager.connection.driver.escapeQueryWithParameters(sql, params, {});
    return this.manager.query(q, p);
  }
  async $rawSqlFile(path: string, params: ObjectLiteral) {
    const sql = await ReadSQLFile(path);
    return this.$rawSql(sql, params);
  }
}
