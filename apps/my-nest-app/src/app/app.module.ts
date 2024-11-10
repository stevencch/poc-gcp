import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { LoggerModule } from '@poc-gcp/logger';

@Module({
  imports:[UserModule,LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
