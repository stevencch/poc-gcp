import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MssqlModule } from '@poc-gcp/mssql';
import { PubsubModule } from '@poc-gcp/pubsub';
import { StorageModule } from '@poc-gcp/storage';
import { CsvProcessorModule } from '@poc-gcp/csv-processor';
import { CloudTasksModule } from '@poc-gcp/cloud-tasks';
import { ConfigModule } from '@nestjs/config';
import userConfig from './user.config';
@Module({
  imports: [
    MssqlModule,
    PubsubModule,
    StorageModule,
    CsvProcessorModule,
    CloudTasksModule,
    ConfigModule.forRoot({
      load: [userConfig],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
