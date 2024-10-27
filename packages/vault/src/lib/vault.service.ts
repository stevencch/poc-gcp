import { Inject, Injectable } from '@nestjs/common';
import vaultConfig from './vault.config';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class VaultService {
  clientId = process.env["hpc_client_id"];
  clientSecret = process.env["hpc_client_secret"];;
  organizationId = '1da7c652-6f8c-4ccf-8ed3-f39b40027727';
  projectId = '146ca36c-81df-476d-b515-c46f81056e20';
  appId = 'sample-app';

  constructor(
    @Inject(vaultConfig.KEY)
    private readonly config: ConfigType<typeof vaultConfig>
  ) {}

  async getAccessToken(): Promise<string> {
    try {
      const response = await axios.post(
        'https://auth.idp.hashicorp.com/oauth2/token',
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
          audience: 'https://api.hashicorp.cloud',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw error;
    }
  }

  async getSecretValue(accessToken: string, secretName: string): Promise<string> {
    try {
      const response = await axios.get(
        `https://api.cloud.hashicorp.com/secrets/2023-06-13/organizations/${this.organizationId}/projects/${this.projectId}/apps/${this.appId}/open/${secretName}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.secret.version.value;
    } catch (error) {
      console.error('Failed to get secret value:', error);
      throw error;
    }
  }

  async getVaultSecrets<T>(): Promise<T> {
    if (isRunningLocally()) {
      return process.env as T;
    }
    const accessToken = await this.getAccessToken();
    const secretValue = await this.getSecretValue(accessToken,"MSSQL_CONNECTION_STRING");
    return {mssql_connection_string:secretValue} as T;
    
  }
}

export function isRunningLocally(): boolean {
  const cloudRunEnvVars = [
    'K_SERVICE',
    'K_REVISION',
    'K_CONFIGURATION',
    'CLOUD_RUN_JOB',
    'CLOUD_RUN_EXECUTION',
    'CLOUD_RUN_TASK_INDEX',
    'CLOUD_RUN_TASK_ATTEMPT',
    'CLOUD_RUN_TASK_COUNT',
  ];

  return !Object.keys(process.env).some((key) => cloudRunEnvVars.includes(key));
}
