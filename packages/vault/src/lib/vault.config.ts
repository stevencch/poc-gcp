import { registerAs } from '@nestjs/config';
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';


type VaultConfig = {
  vaultMountPoint: string;
  vaultRoleName: string;
  serviceAccountEmail: string;
  vaultEndpoint: string;
  vaultNamespace: string;
  vaultPath: string;
};

export default registerAs('vault', () => {
  const vaultConfig = {
    vaultMountPoint: process.env['VAULT_MOUNT_POINT'],
    vaultRoleName: process.env['VAULT_ROLE_NAME'],
    serviceAccountEmail: process.env['SERVICE_ACCOUNT_EMAIL'],
    vaultEndpoint: process.env['VAULT_ENDPOINT'],
    vaultNamespace: process.env['VAULT_NAMESPACE'],
    vaultPath: process.env['VAULT_PATH'],
  };

  return vaultConfig;
});

export const VAULT_SECRETS = 'VAULT_SECRETS';
