/* istanbul ignore file */

import { Expose } from 'class-transformer';
import { SessionEntity } from './session.entity';
import { AdditionalDetailsEntity } from './additional-details.entity';
import { BalanceCheckEntity } from './balance-check.entity';
import { IsOptional } from 'class-validator';
import { PaymentEntity } from './payment.entity';

export class PaymentsEntity {
  @Expose()
  @IsOptional()
  session: SessionEntity;

  @Expose()
  @IsOptional()
  additionalDetails: AdditionalDetailsEntity;

  @Expose()
  @IsOptional()
  balance: BalanceCheckEntity;

  @Expose()
  @IsOptional()
  payment: PaymentEntity;

  constructor(payment: Partial<PaymentsEntity>) {
    this.session = new SessionEntity(payment.session);
    this.additionalDetails = new AdditionalDetailsEntity(
      payment.additionalDetails
    );
    this.balance = new BalanceCheckEntity(payment.balance);
    this.payment = new PaymentEntity(payment.payment);
  }
}
