import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';

const ajv = new Ajv();



export default registerAs('firestore', () => {
  const firestoreConfig = {
    projectId: process.env['PROJECT_ID'],
    databaseId: process.env['DATABASE_ID'] || 'localhost:8080',
  };

  return firestoreConfig;
});
