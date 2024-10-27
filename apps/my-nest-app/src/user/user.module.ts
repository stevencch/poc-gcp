import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MssqlModule } from '@poc-gcp/mssql';

@Module({
  imports: [
    MssqlModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
