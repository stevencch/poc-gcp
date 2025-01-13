import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

import { RedisSecrets } from './redis.types';
import { getRedisClient } from './redis.client';
import { isRunningLocally } from '../utils';
import { getMockRedisClient } from './mockRedis.client';
import { VaultModule } from '@poc-gcp/vault';

@Module({
  imports: [VaultModule],
  providers: [
    RedisService,
    {
      provide: 'WRITER_REDIS',
      useFactory: async (secrets: RedisSecrets) => {
        const client = isRunningLocally()
          ? getMockRedisClient()
          : getRedisClient(
              secrets.WRITER_REDIS_HOST_ID,
              secrets.REDIS_PORT,
              secrets.REDIS_CERT,
              secrets.REDIS_DB_NUMBER
            );
        return client;
      },
      inject: ['VAULT_SECRETS'],
    },
    {
      provide: 'READER_REDIS',
      useFactory: async (secrets: RedisSecrets) => {
        const client = isRunningLocally()
          ? getMockRedisClient()
          : getRedisClient(
              secrets.READER_REDIS_HOST_ID,
              secrets.REDIS_PORT,
              secrets.REDIS_CERT,
              secrets.REDIS_DB_NUMBER
            );
        return client;
      },
      inject: ['VAULT_SECRETS'],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
