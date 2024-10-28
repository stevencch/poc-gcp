import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject } from 'ajv';

const ajv = new Ajv();

type CommercetoolsConfig = {
  apiUrl: string;
  authUrl: string;
  projectKey: string;
};

const commercetoolsConfigSchema: object = {
  type: 'object',
  properties: {
    apiUrl: { type: 'string' },
    authUrl: { type: 'string' },
    projectKey: { type: 'string' },
  },
  required: ['apiUrl', 'authUrl', 'projectKey'],
};

const validate = ajv.compile(commercetoolsConfigSchema);

export const CommercetoolsConfig = registerAs('CommercetoolsConfig', () => {
  const values = {
    apiUrl: process.env['CT_API_URL'] || "https://api.australia-southeast1.gcp.commercetools.com",
    authUrl: process.env['CT_AUTH_URL'] || "https://auth.australia-southeast1.gcp.commercetools.com",
    projectKey: process.env['CT_PROJECT_KEY'] || "cwr-au-dev",
  };

  if (!validate(values)) {
    const errors = validate.errors as ErrorObject[];
    const message = errors.map((error) => error.message).join(', ');

    throw new Error(
      `Commercetools module configuration validation failed: ${message}`
    );
  }

  return values;
});

export type CommercetoolsSecrets = {
  ct_client_id?: string;
  ct_client_secret?: string;
  ct_scopes?: string;
};
