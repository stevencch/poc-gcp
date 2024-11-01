import { Knex } from 'knex';
import fs from 'node:fs';
import { SCHEMA_SQL_OUTPUT_FILE } from '../constants';
import { addSqlTerminator } from './common';
import { MIGRATION_KEYWORDS } from './keywords';

export function logMigrationQuery(message: Knex.Sql) {
  if (!shouldLogMigrationQuery(message)) return;

  writeMigrationQuery(message);
}

function shouldLogMigrationQuery(message: Knex.Sql): boolean {
  if (Array.isArray(message)) {
    return message.some((entry) => includeSqlOnKeyword(entry.sql));
  }

  if (typeof message === 'object' && message.sql) {
    return includeSqlOnKeyword(message.sql);
  }

  return false;
}

function writeMigrationQuery(message: any): void {
  let output = '';

  if (Array.isArray(message)) {
    output = message.map((entry) => addSqlTerminator(entry?.sql)).join('\n');
  } else if (typeof message === 'object' && message.sql) {
    output = addSqlTerminator(message.sql);
  }

  fs.appendFileSync(SCHEMA_SQL_OUTPUT_FILE, output);
}

function includeSqlOnKeyword(sql: string): boolean {
  return excludeKnexMigrationQuery(sql) && containsMigrationKeyword(sql);
}

function excludeKnexMigrationQuery(sql: string): boolean {
  return ['knex_migrations'].some((keyword) => !sql.toLowerCase().includes(keyword));
}

function containsMigrationKeyword(sql: string): boolean {
  return MIGRATION_KEYWORDS.some((keyword) => sql.toLowerCase().includes(keyword));
}
