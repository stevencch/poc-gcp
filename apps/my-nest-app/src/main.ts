require('newrelic');
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getLoggingLevels, isRunningLocally } from '@poc-gcp/common';

async function bootstrap() {
  Object.keys(process.env).forEach((key) => {
    Logger.warn(`ENV: ${key}: ${process.env[key]}`);
  });
  const loggingLevels = getLoggingLevels();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: loggingLevels,
  });

  app.useBodyParser('raw', { type: 'application/protobuf' });

  app.use(
    '/api/payment/handler1',
    createProxyMiddleware({
        target: 'https://webhook.site/28cec492-dc6c-4a34-96d5-e8d1a1fa5aca', // New destination URL
        changeOrigin: true,
    })
);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3002;
  await app.listen(port);

  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
