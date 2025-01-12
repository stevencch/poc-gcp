import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { OrdersModule } from '../orders/orders.module';
import { NewRelicService } from './new-relic.service';
import { LoggerModule } from 'nestjs-pino';
import { loggerOptions } from './logger';

@Module({
  imports:[LoggerModule.forRoot(loggerOptions),UserModule,OrdersModule],
  controllers: [AppController],
  providers: [AppService, NewRelicService],
})
export class AppModule {}
