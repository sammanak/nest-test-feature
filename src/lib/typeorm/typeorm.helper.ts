import stack from 'callsites';
import { readFile } from 'fs';
import { dirname, resolve } from 'path';
import { promisify } from 'util';

const readFileAsync = promisify(readFile);
export async function ReadSQLFile(sqlPath: string) {
  const caller = stack()[0].getFileName() || '';
  const callerDirname = dirname(caller);
  return readFileAsync(resolve(callerDirname, '../', sqlPath), 'utf8');
}
