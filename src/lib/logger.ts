// src/lib/logger.ts
import fs from 'fs';
import path from 'path';

const logFile = path.resolve('./logs/api-errors.log');

export function logError(message: string, meta?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    message,
    meta: meta || {},
  };
  try {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n', 'utf8');
  } catch (e) {
    console.error('[LOGGER ERROR]', e);
  }
}