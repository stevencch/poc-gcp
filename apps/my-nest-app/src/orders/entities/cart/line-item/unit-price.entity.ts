import { Expose } from 'class-transformer';
import { PriceDetails } from '@cw/cart-service/types/commercetools-cart.type';
import { ValueEntity } from '../totals/price.entity';

export class UnitPriceEntity {
  @Expose()
  original: ValueEntity;
  @Expose()
  price: ValueEntity;

  constructor(price: PriceDetails) {
    this.original = new ValueEntity(
      price.value.centAmount,
      price.value.fractionDigits,
      price.value.currencyCode
    );
    this.price = price.discounted
      ? new ValueEntity(
          price.discounted.value.centAmount,
          price.value.fractionDigits,
          price.discounted.value.currencyCode
        )
      : this.original;
  }
}
