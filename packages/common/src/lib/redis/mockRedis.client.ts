import { Logger } from '@nestjs/common';
import MockRedis from 'ioredis-mock';

export const getMockRedisClient = () => {
  const logger = new Logger('MockRedisClient');
  logger.debug('Connected to mock redis.');
  const client = new MockRedis();
  return client;
};
