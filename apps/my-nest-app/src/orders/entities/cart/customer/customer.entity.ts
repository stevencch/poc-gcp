import { Expose } from 'class-transformer';
import { CTCart } from '@cw/cart-service/types/commercetools-cart.type';

export class CustomerEntity {
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  mobile: string;
  @Expose()
  email: string;

  constructor(partial: Partial<CustomerEntity>) {
    Object.assign(this, partial);
  }

  static fromCart(cart: CTCart): CustomerEntity {
    return new CustomerEntity({
      email: cart.customerEmail,
      firstName: cart.billingAddress?.firstName || null,
      lastName: cart.billingAddress?.lastName || null,
      mobile: cart.billingAddress?.phone || null,
    });
  }
}
