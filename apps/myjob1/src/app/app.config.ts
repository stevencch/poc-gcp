import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';

export default registerAs('app', () => {
  const appConfig = {
    projectId: process.env["GCP_PROJECT_ID"]
  };
  return appConfig;
});
