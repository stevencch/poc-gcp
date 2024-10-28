import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { CommercetoolsModule } from '@poc-gcp/commercetools';
@Module({
  imports:[CommercetoolsModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
