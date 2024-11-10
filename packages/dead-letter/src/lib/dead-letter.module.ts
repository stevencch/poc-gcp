import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DeadLetterService } from './dead-letter.service';
import deadLetterConfig from './dead-letter.config';
import { CommonModule } from '@poc-gcp/common';
import { PubsubModule } from '@poc-gcp/pubsub';

@Module({
  imports: [ConfigModule.forFeature(deadLetterConfig), CommonModule, PubsubModule],
  providers: [DeadLetterService],
  exports: [DeadLetterService],
})
export class DeadLetterModule {}
