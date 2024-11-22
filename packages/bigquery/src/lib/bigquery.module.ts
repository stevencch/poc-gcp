import { Module } from '@nestjs/common';
import { BigQueryService } from './bigquery.service';
import { ConfigModule } from '@nestjs/config';
import { BigQueryConfig } from './bigquery.config';

@Module({
  imports: [
    ConfigModule.forFeature(BigQueryConfig)
  ],
  providers: [BigQueryService],
  exports: [BigQueryService],
})
export class BigqueryModule {}
