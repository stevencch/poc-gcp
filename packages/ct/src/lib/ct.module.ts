import { Module } from '@nestjs/common';

import { CtService } from './ct.service';
import { VaultModule } from '@poc-gcp/vault';

@Module({
  imports: [VaultModule],
  providers: [
    CtService,
    {
      provide: 'COMMERCETOOLS_CLIENT',
      useFactory: async (commercetoolsService: CtService) => {
        return await commercetoolsService.getClient();
      },
      inject: [CtService],
    },
  ],
  exports: ['COMMERCETOOLS_CLIENT']
})
export class CtModule {}
