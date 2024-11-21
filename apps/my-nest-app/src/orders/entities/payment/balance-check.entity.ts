/* istanbul ignore file */
import { Expose } from 'class-transformer';

export class BalanceCheckEntity {
  @Expose()
  uiPayload: string;

  constructor(balance: Partial<BalanceCheckEntity>) {
    Object.assign(this, balance);
  }
}
