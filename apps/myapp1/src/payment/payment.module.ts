import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { CommercetoolsModule } from '@poc-gcp/commercetools';
import { DatabaseModule } from '@poc-gcp/database';
import { FirestoreModule } from '@poc-gcp/firestore';
import { CommonModule } from '@poc-gcp/common';
import { DeadLetterModule } from '@poc-gcp/dead-letter';
@Module({
  imports:[CommercetoolsModule,
    DatabaseModule,
    FirestoreModule,
    CommonModule,
    DeadLetterModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
