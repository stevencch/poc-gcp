import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import appConfig from './app.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
