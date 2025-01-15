import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { OrdersModule } from '../orders/orders.module';
import { NewRelicService } from './new-relic.service';
import { LoggerModule } from 'nestjs-pino';
import { loggerOptions } from './logger';
import { RedisModule, RedisService } from '@poc-gcp/common';

@Module({
  imports:[LoggerModule.forRoot(loggerOptions),UserModule,OrdersModule, RedisModule
  ],
  controllers: [AppController],
  providers: [AppService, NewRelicService,RedisService]
})
export class AppModule {}
