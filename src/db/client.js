import { createClient } from '@libsql/client';
import { config } from '../config.js';
import path from 'node:path';
import fs from 'node:fs';

let client;

export function getDb() {
  if (client) return client;

  if (config.turso.url) {
    client = createClient({
      url: config.turso.url,
      authToken: config.turso.token,
    });
    console.log('[db] Connected to Turso:', config.turso.url.replace(/(libsql:\/\/)([^.]+)/, '$1***'));
  } else {
    const dataDir = path.resolve('data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const file = path.join(dataDir, 'app.db');
    client = createClient({ url: `file:${file}` });
    console.log('[db] Using local SQLite file:', file);
    if (config.env === 'production') {
      console.warn('[db] WARNING: Render free tier has ephemeral filesystem — data will be lost on restart. Set TURSO_DATABASE_URL.');
    }
  }
  return client;
}
