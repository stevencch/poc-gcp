import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VaultModule } from '@poc-gcp/vault';
import { CommercetoolsConfig } from './commercetools.config';
import { CommercetoolsService } from './commercetools.service';

@Module({
  imports: [
    ConfigModule.forFeature(CommercetoolsConfig),
    // FirestoreModule,
    VaultModule,
  ],
  controllers: [],
  providers: [CommercetoolsService],
  exports: [CommercetoolsService],
})
export class CommercetoolsModule {}
