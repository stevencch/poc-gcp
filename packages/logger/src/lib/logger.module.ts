import { Module } from '@nestjs/common';
import { GcpLogger } from './gcp-logger.service';

@Module({
  controllers: [],
  providers: [GcpLogger],
  exports: [GcpLogger],
})
export class LoggerModule {}
