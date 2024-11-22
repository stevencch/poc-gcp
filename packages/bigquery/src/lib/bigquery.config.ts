import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject } from 'ajv';


export const BigQueryConfig = registerAs('BigQueryConfig', () => {
  const values = {
    projectId: process.env['PROJECT_ID'] || "poc-gcp-439306"
  };

  return values;
});

