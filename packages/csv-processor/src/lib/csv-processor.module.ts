import { Module } from '@nestjs/common';
import { CsvProcessorService } from './csv-processor.service';

@Module({
  controllers: [],
  providers: [CsvProcessorService],
  exports: [CsvProcessorService],
})
export class CsvProcessorModule {}
