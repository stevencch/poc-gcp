import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';

type DatabaseConfig = {
  databaseName: string;
  databaseUser: string;
  primaryInstanceConnectionName: string;
  replicaInstanceConnectionName: string;
};

// const databaseSchema: JSONSchemaType<DatabaseConfig> = {
//   type: 'object',
//   properties: {
//     databaseName: { type: 'string', minLength: 1 },
//     databaseUser: { type: 'string', minLength: 1 },
//     primaryInstanceConnectionName: { type: 'string', minLength: 1 },
//     replicaInstanceConnectionName: { type: 'string', minLength: 1 },
//   },
//   required: ['databaseName', 'databaseUser', 'primaryInstanceConnectionName', 'replicaInstanceConnectionName'],
// };

// const ajv = new Ajv();
// const validate = ajv.compile(databaseSchema);

export default registerAs('database', () => {
  const databaseConfig: DatabaseConfig = {
    databaseName: process.env['DB_IP'] ?? 'postgres',
    databaseUser: process.env['SQL_DATABASE_USER'] ?? 'admin',
    primaryInstanceConnectionName: process.env['SQL_DATABASE_PRIMARY_INSTANCE_CONNECTION_NAME'] ?? 'xxx',
    replicaInstanceConnectionName: process.env['SQL_DATABASE_REPLICA_INSTANCE_CONNECTION_NAME'] ?? 'xxx',
  };

  // if (!validate(databaseConfig)) {
  //   const errors = validate.errors as ErrorObject[];
  //   const message = errors.map((error) => error.message).join(', ');

  //   throw new Error(`Database configuration validation failed: ${message}`);
  // }

  return databaseConfig;
});
