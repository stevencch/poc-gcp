/* istanbul ignore file */
import { Expose } from 'class-transformer';

export class PaymentEntity {
  @Expose()
  uiPayload: string;

  constructor(payment: Partial<PaymentEntity>) {
    Object.assign(this, payment);
  }
}
