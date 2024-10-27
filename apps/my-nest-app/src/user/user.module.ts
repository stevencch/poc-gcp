import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MssqlModule } from '@poc-gcp/mssql';
import { PubsubModule } from '@poc-gcp/pubsub';

@Module({
  imports: [
    MssqlModule,
    PubsubModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
