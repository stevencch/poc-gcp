import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { LoggerModule } from '@poc-gcp/logger';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports:[UserModule,LoggerModule,OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
