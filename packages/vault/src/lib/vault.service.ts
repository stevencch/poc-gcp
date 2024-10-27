import { Inject, Injectable } from '@nestjs/common';
import vaultConfig from './vault.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class VaultService {
  constructor(
    @Inject(vaultConfig.KEY)
    private readonly config: ConfigType<typeof vaultConfig>
  ) {}

  async getVaultSecrets<T>(): Promise<T> {
    if (isRunningLocally()) {
      return process.env as T;
    }
    return process.env as T;
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
