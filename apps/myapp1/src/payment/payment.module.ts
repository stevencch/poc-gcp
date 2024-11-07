import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { CommercetoolsModule } from '@poc-gcp/commercetools';
import { DatabaseModule } from '@poc-gcp/database';
import { FirestoreModule } from '@poc-gcp/firestore';
import { ProtobufService } from '@poc-gcp/common';
@Module({
  imports:[CommercetoolsModule,
    DatabaseModule,
    FirestoreModule,
    ProtobufService
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
