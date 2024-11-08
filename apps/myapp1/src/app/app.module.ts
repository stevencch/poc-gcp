import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from '../payment/payment.module';
import { LoggerModule } from '@poc-gcp/logger';

@Module({
  imports: [PaymentModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
