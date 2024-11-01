import { Knex } from 'knex';
import sharedConfig from './sharedConfig';
import { logMigrationQuery } from './utils/migration';
import { logSeedQuery } from './utils/seed';

const config: { [key: string]: Knex.Config } = {
  local: {
    ...sharedConfig,
  },
  'local:migrate': {
    ...sharedConfig,
    debug: true,
    log: {
      async debug(message) {
        logMigrationQuery(message);
      },
    },
  },
  'local:seed': {
    ...sharedConfig,
    debug: true,
    log: {
      async debug(message) {
        logSeedQuery(message);
      },
    },
  },
};

export default config;
