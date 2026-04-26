import { ensureSchema } from './schema.js';

ensureSchema()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
