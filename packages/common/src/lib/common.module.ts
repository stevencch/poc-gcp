import { Module } from '@nestjs/common';
import { ProtobufService } from './protobuf';

@Module({
  controllers: [],
  providers: [ProtobufService,],
  exports: [ProtobufService,],
})
export class CommonModule {}
