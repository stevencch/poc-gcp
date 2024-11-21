import { Expose } from 'class-transformer';
import { CartEntity } from './cart/cart.entity';
import { PaymentsEntity } from './payment/payments.entity';

export class ResponseEntity {
  @Expose()
  cart: CartEntity;

  @Expose()
  payments?: PaymentsEntity;

  constructor(partial: Partial<ResponseEntity>) {
    Object.assign(this, partial);
  }
}
