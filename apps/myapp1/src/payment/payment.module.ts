import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { CommercetoolsModule } from '@poc-gcp/commercetools';
import { DatabaseModule } from '@poc-gcp/database';
@Module({
  imports:[CommercetoolsModule,
    DatabaseModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
