import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

import { RedisSecrets } from './redis.types';
import { getRedisClient } from './redis.client';
import { isRunningLocally } from '../utils';
import { VaultModule } from '@poc-gcp/vault';

@Module({
  imports:[],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
