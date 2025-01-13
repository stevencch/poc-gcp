export type RedisSecrets = {
  REDIS_PORT: number | 6379
  WRITER_REDIS_HOST_ID: string;
  READER_REDIS_HOST_ID: string;
  REDIS_CERT: string;
  REDIS_DB_NUMBER: number;
}

export type RedisError = {
  code: string
}