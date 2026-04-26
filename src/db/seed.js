// CLI entry: chay `npm run db:seed` de force re-seed (xoa va insert lai)
import { getDb } from './client.js';
import { ensureSchema } from './schema.js';
import { forceSeed } from './seed-data.js';

(async () => {
  await ensureSchema();
  const db = getDb();
  await forceSeed(db);
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
