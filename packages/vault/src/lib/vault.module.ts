import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import vaultConfig, { VAULT_SECRETS } from './vault.config';
import { VaultService } from './vault.service';

@Module({
  imports: [ConfigModule.forFeature(vaultConfig)],
  controllers: [],
  providers: [
    VaultService,
    {
      provide: VAULT_SECRETS,
      useFactory: async (vaultService: VaultService) => {
        const secrets = await vaultService.getVaultSecrets();
        return secrets;
      },
      inject: [VaultService],
    },
  ],
  exports: [VaultService, VAULT_SECRETS],
})
export class VaultModule {}
