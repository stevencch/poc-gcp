import { Expose } from 'class-transformer';
import { ValueWrapper } from '../totals/price.entity';
import { Price } from '@cw/cart-service/types/commercetools-cart.type';

export class LineItemTotalEntity {
  @Expose()
  original: ValueWrapper;
  @Expose()
  total: ValueWrapper;

  constructor(totalPrice: Price, originalPrice: Price, quantity: number) {
    this.original = new ValueWrapper(
      originalPrice.centAmount * quantity,
      originalPrice.fractionDigits,
      originalPrice.currencyCode
    );
    this.total = new ValueWrapper(
      totalPrice.centAmount,
      totalPrice.fractionDigits,
      totalPrice.currencyCode
    );
  }
}
