/* istanbul ignore file */
import { Expose } from 'class-transformer';

export class OrderEntity {
  @Expose()
  orderNumber: string;

  constructor(order: Partial<OrderEntity>) {
    Object.assign(this, order);
  }
}
