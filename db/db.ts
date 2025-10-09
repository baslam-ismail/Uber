import knex, { Knex } from 'knex';
import cfg from './knexfile.js';
const env = (process.env.NODE_ENV || 'development') as 'development' | 'test';
export const db: Knex = knex(cfg[env]);
