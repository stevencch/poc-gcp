import { Knex } from 'knex';
import fs from 'node:fs';
import { SEED_SQL_OUTPUT_FILE } from '../constants';
import { addSqlTerminator } from './common';
import { DML_KEYWORDS } from './keywords';

export function logSeedQuery(message: Knex.Sql) {
  if (!shouldLogSeedQuery(message)) return;

  writeSeedQuery(message);
}

function shouldLogSeedQuery(message: Knex.Sql): boolean {
  if (Array.isArray(message)) {
    return message.some((entry) => containsDmlKeyword(entry.sql));
  }

  if (typeof message === 'object' && message.sql) {
    return containsDmlKeyword(message.sql);
  }

  return false;
}

function writeSeedQuery(message: any): void {
  let output = '';

  if (Array.isArray(message)) {
    output = message
      .map((entry) => {
        if (entry.sql && Array.isArray(entry.bindings)) {
          return replaceBindings(entry.sql, entry.bindings);
        }

        return addSqlTerminator(entry?.sql);
      })
      .join('\n');
  } else if (typeof message === 'object' && message.sql && Array.isArray(message.bindings)) {
    output = replaceBindings(message.sql, message.bindings);
  }

  fs.appendFileSync(SEED_SQL_OUTPUT_FILE, output);
}

function containsDmlKeyword(sql: string): boolean {
  return DML_KEYWORDS.some((keyword) => sql.toLowerCase().includes(keyword));
}

function replaceBindings(sql: string, bindings: any[]): string {
  let i = 0;
  const replacedSql = sql.replace(/\?/g, () => {
    const binding = bindings[i++];

    if (typeof binding === 'string') {
      return `'${binding.replace(/'/g, "''")}'`;
    }

    return binding;
  });

  return addSqlTerminator(replacedSql);
}
