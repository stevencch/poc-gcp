import path from 'node:path';

export const OUTPUT_DIRECTORY = path.join(__dirname, 'sql');

export const SCHEMA_SQL_OUTPUT_FILE = path.join(OUTPUT_DIRECTORY, './migrations.sql');
export const SEED_SQL_OUTPUT_FILE = path.join(OUTPUT_DIRECTORY, './seeds.sql');
