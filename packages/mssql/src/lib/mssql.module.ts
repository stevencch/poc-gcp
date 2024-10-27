import { Module } from '@nestjs/common';
import { VaultModule } from '@poc-gcp/vault';
import { MssqlService } from './mssql.service';

@Module({
  imports: [VaultModule],
  providers: [MssqlService],
  exports: [MssqlService],
})
export class MssqlModule {}
