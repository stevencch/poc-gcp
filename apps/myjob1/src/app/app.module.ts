import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import appConfig from './app.config';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@poc-gcp/logger';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    LoggerModule
  ],
  providers: [AppService],
})
export class AppModule {}
