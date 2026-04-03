import morgan from 'morgan';
import { env } from '../config/env';

// Concise format in dev, combined format in production
export const requestLogger = morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined');
