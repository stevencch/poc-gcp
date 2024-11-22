import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject } from 'ajv';


export const BigQueryConfig = registerAs('BigQueryConfig', () => {
  const values = {
    apiUrl: process.env['PROJECT_ID'] || "https://api.australia-southeast1.gcp.commercetools.com",
    authUrl: process.env['CT_AUTH_URL'] || "https://auth.australia-southeast1.gcp.commercetools.com",
    projectKey: process.env['CT_PROJECT_KEY'] || "cwr-au-dev",
  };

  return values;
});

