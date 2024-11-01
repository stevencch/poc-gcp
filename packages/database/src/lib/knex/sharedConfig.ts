import { Knex } from 'knex';
import path from 'node:path';

const sharedLocalConfig: Knex.Config = {
  client: 'pg',
  // @todo (post build) - get this from environment variable(s)
  connection: 'postgres://admin:admin@localhost:5432/shipping-ms',
  pool: {
    min: 0,
    max: 10,
  },
  migrations: {
    directory: path.join(__dirname, './migrations'),
  },
  seeds: {
    directory: path.join(__dirname, './seeds'),
  },
};

export default sharedLocalConfig;
