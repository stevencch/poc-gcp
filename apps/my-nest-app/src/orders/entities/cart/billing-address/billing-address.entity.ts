import { Expose } from 'class-transformer';
import { CTCart } from '@cw/cart-service/types/commercetools-cart.type';

export class BillingAddressEntity {
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  country: string;
  @Expose()
  streetName: string;
  @Expose()
  streetNumber: string;
  @Expose()
  postalCode: string;
  @Expose()
  city: string;
  @Expose()
  state: string;
  @Expose()
  building: string;
  @Expose()
  phone: string;
  @Expose()
  email: string;

  constructor(partial: Partial<BillingAddressEntity>) {
    Object.assign(this, partial);
  }

  static fromCart(cart: CTCart): BillingAddressEntity {
    return new BillingAddressEntity({
      firstName: cart.billingAddress?.firstName || null,
      lastName: cart.billingAddress?.lastName || null,
      phone: cart.billingAddress?.phone || null,
      country: cart.billingAddress?.country || null,
      streetName: cart.billingAddress?.streetName || null,
      streetNumber: cart.billingAddress?.streetNumber || null,
      postalCode: cart.billingAddress?.postalCode || null,
      city: cart.billingAddress?.city || null,
      state: cart.billingAddress?.state || null,
      building: cart.billingAddress?.building || null,
      email: cart.billingAddress?.email || null,
    });
  }
}
