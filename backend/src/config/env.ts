import dotenv from 'dotenv';
import path from 'path';
import { cleanEnv, str, port } from 'envalid';

// Load .env BEFORE validation — must happen here because
// ES module imports are hoisted above server.ts body code
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = cleanEnv(process.env, {
  PORT:           port({ default: 4000 }),
  NODE_ENV:       str({ choices: ['development', 'production', 'test'], default: 'development' }),
  DATABASE_URL:   str(),
  JWT_SECRET:     str(),
  JWT_EXPIRES_IN: str({ default: '7d' }),
  FIREBASE_PROJECT_ID: str({ default: '' }),
});
