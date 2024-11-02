import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';

const ajv = new Ajv();

type FirestoreConfig = {
  projectId: string;
  databaseId: string;
};

const firestoreConfigSchema: JSONSchemaType<FirestoreConfig> = {
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    databaseId: { type: 'string' },
  },
  required: ['projectId', 'databaseId'],
};

const validate = ajv.compile(firestoreConfigSchema);

export default registerAs('firestore', () => {
  const firestoreConfig = {
    projectId: process.env['PROJECT_ID'],
    databaseId: process.env['DATABASE_ID'],
  };

  if (!validate(firestoreConfig)) {
    const errors = validate.errors as ErrorObject[];
    const message = errors.map((error) => error.message).join(', ');

    throw new Error(`Firestore configuration validation failed: ${message}`);
  }

  return firestoreConfig;
});
