import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MssqlModule } from '@poc-gcp/mssql';
import { PubsubModule } from '@poc-gcp/pubsub';
import { StorageModule } from '@poc-gcp/storage';
import { CsvProcessorModule } from '@poc-gcp/csv-processor';

@Module({
  imports: [
    MssqlModule,
    PubsubModule,
    StorageModule,
    CsvProcessorModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
