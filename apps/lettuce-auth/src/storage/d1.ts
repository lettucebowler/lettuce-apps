import { joinKey, splitKey, type StorageAdapter } from '@openauthjs/openauth/storage/storage';

export async function CloudflareD1Storage(d1: D1Database): Promise<StorageAdapter> {
  const tableName = 'openauth';

  const setupSql = /*sql*/ `CREATE TABLE IF NOT EXISTS ${tableName} (key TEXT PRIMARY KEY, value TEXT NOT NULL, expiry TEXT);`;
  await d1.exec(setupSql);

  async function get(key: string[]) {
    // console.log('get', key.join('.'));
    const row = await d1
      .prepare(`SELECT value, expiry FROM ${tableName} WHERE key = ?`)
      .bind(joinKey(key))
      .first<any>();
    if (!row) return null;
    if (row.expiry && new Date(row.expiry) < new Date()) {
      await remove(key);
      return null;
    }
    const value = JSON.parse(row.value);
    return value;
  }

  async function set(key: string[], value: any, expiry?: Date) {
    // console.log('set', key.join('.'), value, expiry);
    const text = JSON.stringify(value);
    await d1
      .prepare(
        `INSERT INTO ${tableName} (key, value, expiry) VALUES (?, ?, ?) ON CONFLICT (KEY) DO UPDATE SET value=excluded.value, expiry=excluded.expiry`,
      )
      .bind(joinKey(key), text, expiry?.toISOString() ?? null)
      .run();
  }

  async function remove(key: string[]) {
    // console.log('remove', key.join('.'));
    await d1.prepare(`DELETE FROM ${tableName} WHERE key = ?`).bind(joinKey(key)).run();
  }

  async function* scan(prefix: string[]): AsyncIterable<[string[], any]> {
    // console.log('scan', prefix.join('.'));
    const prefixString = joinKey([...prefix, '']);
    let offset = 0;
    let batchSize = 100;

    while (true) {
      const { results }: any = await d1
        .prepare(`SELECT key, value, expiry FROM ${tableName} where key like ? ORDER BY key LIMIT ? OFFSET ?`)
        .bind(`${prefixString}%`, batchSize, offset)
        .all();

      if (results.length === 0) break;

      for (const row of results) {
        if (row.expiry && new Date(row.expiry) < new Date()) {
          await remove(splitKey(row.key));
          continue;
        }
        const result: [string[], any] = [splitKey(row.key), JSON.parse(row.value)];
        yield result;
      }

      if (results.length < batchSize) break;
      offset += batchSize;
    }
  }

  return { get, set, remove, scan };
}
