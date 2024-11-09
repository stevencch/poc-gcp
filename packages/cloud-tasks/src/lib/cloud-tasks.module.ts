import { Module } from '@nestjs/common';
import { CloudTasksService } from './cloud-tasks.service';
import { ConfigModule } from '@nestjs/config';
import cloudTasksConfig from './cloud-tasks.config';

@Module({
  imports: [ConfigModule.forFeature(cloudTasksConfig)],
  providers: [CloudTasksService],
  exports: [CloudTasksService],
})
export class CloudTasksModule {}