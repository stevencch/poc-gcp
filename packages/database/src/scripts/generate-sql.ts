import { knex } from 'knex';
import fs from 'node:fs';
import * as sqlFormatter from 'sql-formatter';
import { OUTPUT_DIRECTORY, SCHEMA_SQL_OUTPUT_FILE, SEED_SQL_OUTPUT_FILE } from '../lib/knex/constants';
import knexConfig from '../lib/knex/knexfile';

const localDb = knex(knexConfig['local']);
const migrateDb = knex(knexConfig['local:migrate']);
const seedDb = knex(knexConfig['local:seed']);

(async () => {
  try {
    if (!fs.existsSync(OUTPUT_DIRECTORY)) {
      fs.mkdirSync(OUTPUT_DIRECTORY);
    }

    // Schema can only be generated on a fresh database instance, so must rollback
    await localDb.migrate.rollback();

    await executeAction(SCHEMA_SQL_OUTPUT_FILE, () => migrateDb.migrate.latest());
    await executeAction(SEED_SQL_OUTPUT_FILE, () => seedDb.seed.run());
  } catch (e) {
    console.error('Failed to generate SQL', e);
  }
})();

async function executeAction(file: string, action: () => Promise<unknown>) {
  fs.writeFileSync(file, `/* THIS FILE HAS BEEN AUTO-GENERATED ON ${new Date().toUTCString()} */`);

  await action();

  // Format SQL file so any schema changes are easier to identify
  const fileContents = fs.readFileSync(file).toString();
  const formattedContent = sqlFormatter.format(fileContents, {
    language: 'postgresql',
    keywordCase: 'upper',
    linesBetweenQueries: 2,
  });
  fs.writeFileSync(file, formattedContent);
}
