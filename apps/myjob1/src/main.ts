/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { isRunningLocally } from '@poc-gcp/vault';
import { GcpLogger } from '@poc-gcp/logger';
import { AppService } from './app/app.service';
import { getLoggingLevels } from '@poc-gcp/common';

async function bootstrap() {
  const loggingLevels = getLoggingLevels();
  const app = await NestFactory.create(AppModule, {
    logger: loggingLevels,
  });
  if (!isRunningLocally()) app.useLogger(app.get(GcpLogger));
  const service = app.get(AppService);
  Logger.log(`🚀 Application is running`);

  await service.run();

  await app.close();
}

bootstrap();

