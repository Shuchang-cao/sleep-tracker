import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/postgres');
export const db = drizzle(sql, { schema });