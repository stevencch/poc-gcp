import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { getRedisClient } from './redis.client';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly redis: Redis;
  constructor(
  ) {
    this.redis= getRedisClient(
                  process.env["READER_REDIS_HOST_ID"] || '10.86.29.59',
                  6378
                )
  }

  /**
   * Returns a single value
   * @param key 
   * @returns 
   */
  async get(key: string): Promise<string | undefined> {
    const value = (await this.redis.get(key)) || undefined;
    return value;
  }

  /**
   * Batch request for multiple keys
   * @param keys 
   * @returns 
   */
  async mget(keys: string[]) {
    if(keys.length === 0) {
      return {};
    }
    const values = await this.redis.mget(keys);
    const kv = Object.fromEntries(
      keys.map((key, index) => [key, values[index] ? values[index] : undefined])
    );
    return kv;
  }

  /**
   * @param expiry Expiry time in seconds
   */
  private async set(key: string, value: string, expiry: string): Promise<void> {
    const unit = expiry.slice(-1);
    const time = parseFloat(expiry.slice(0, -1));
    let expiryInSeconds: number;
    switch (unit) {
      case 'm':
        expiryInSeconds = time * 60;
        break;
      case 'h':
        expiryInSeconds = time * 60 * 60;
        break;
      case 'd':
        expiryInSeconds = time * 24 * 60 * 60;
        break;
      default:
        this.logger.warn('Invalid expiry time unit. Defaulting to 1 hour.');
        expiryInSeconds = 60 * 60;
        break;
    }
    await this.redis.set(key, value, 'EX', expiryInSeconds);
  }

  async updateKey(
    key: string,
    currentValue: string,
    expiry: string
  ): Promise<boolean> {
    const data = await this.get(key);
    this.logger.log(
      `Key: ${key}, Value: ${data}, Current value: ${currentValue}`
    );
    // if current value doesnt equal to the newly computed md5
    if (data != currentValue || data === undefined) {
      this.logger.log('Updating redis key value.');
      await this.set(key, currentValue, expiry);
      return true;
    }
    this.logger.log('No change to redis value.');
    return false;
  }
}
