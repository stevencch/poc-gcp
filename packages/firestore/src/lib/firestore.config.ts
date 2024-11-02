import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';

const ajv = new Ajv();



export default registerAs('firestore', () => {
  const firestoreConfig = {
    projectId: process.env['GCP_PROJECT_ID'],
    databaseId: process.env['DATABASE_ID'] ,
  };

  return firestoreConfig;
});
