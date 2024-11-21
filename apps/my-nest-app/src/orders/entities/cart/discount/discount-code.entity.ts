import { Expose } from 'class-transformer';
import { CTCart } from '@cw/cart-service/types/commercetools-cart.type';

type DiscountCodeType = {
  discountCode: {
    id: string;
    code: string;
  };
  state: string;
};

export class DiscountCode {
  @Expose()
  code: string;

  @Expose()
  status: string;

  constructor(discountCode: Partial<DiscountCode>) {
    Object.assign(this, discountCode);
  }

  static fromCart(cart: CTCart): DiscountCode[] {
    return (cart.discountCodes || []).map(
      (dc: DiscountCodeType) =>
        new DiscountCode({
          code: dc.discountCode.code,
          status: dc.state === 'MatchesCart' ? 'valid' : 'invalid',
        })
    );
  }
}
