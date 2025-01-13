import { Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

type ErrorType = {
  code: string;
  message: string;
}

export const getRedisClient = (
  redisHost: string,
  redisPort: number,
  redisCert: string,
  redisDBNumber: number
) => {
  const logger = new Logger('RedisClient');
  logger.debug('Connected to production redis');

  const client = new Redis({
    host: redisHost,
    port: redisPort,
    tls: {
      ca: redisCert,
    },
    db: redisDBNumber,
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      logger.warn(`Redis connection attempt ${times}, retrying in ${delay}ms`);
      return delay;
    },
  });

  client.on('error', (error: ErrorType) => {
    if (error.code !== 'ECONNRESET' && error.code !== 'ECONNRESET') {
      logger.error('Redis error')
      logger.error(error);
      throw new Error('Internal Server Error.')
    } else {
      logger.warn(`Redis error: ${error.message}`);
    }
  });

  return client;
};
