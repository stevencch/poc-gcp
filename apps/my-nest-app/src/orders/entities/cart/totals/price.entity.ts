import { Expose } from 'class-transformer';

export class PriceEntity {
  centAmount: number;
  fractionDigits: number;
  currencyCode: string;

  constructor(partial: Partial<PriceEntity>) {
    Object.assign(this, partial);
  }
}

export class ValueEntity {
  @Expose()
  amount: number;
  @Expose()
  currencyCode: string;

  constructor(amount: number, fractionDigits: number, currencyCode: string) {
    this.amount = this.transformPrice(amount, fractionDigits);
    this.currencyCode = currencyCode;
  }

  transformPrice(amount, fractionDigits) {
    return amount / Math.pow(10,fractionDigits);
  }
}

export class ValueWrapper {
  @Expose()
  value: ValueEntity;

  constructor(amount: number, fractionDigits: number, currencyCode: string) {
    this.value = new ValueEntity(amount, fractionDigits, currencyCode);
    Object.assign(this, this.value);
  }
}

export class ShippingPriceEntity {
  @Expose()
  key: string;
  @Expose()
  name: string;
  @Expose()
  methodGrouping: string;
  @Expose()
  value: ValueWrapper;

  constructor(shipping) {
    this.key = shipping.key;
    this.name = shipping.name;
    this.value = new ValueWrapper(
      shipping.value.amount,
      shipping.value.fractionDigits,
      shipping.value.currencyCode
    );
    this.methodGrouping = this.getMethodGrouping(shipping.key);
    Object.assign(this, this.value);
  }

  static fromCart(shippingDetails) {
    return shippingDetails.map((shipping) => new ShippingPriceEntity(shipping));
  }

  getMethodGrouping(key: string) {
    const groups = [
      'fast-delivery',
      'delivery',
      'click-and-collect',
      'digital',
    ];
    return groups.find((group) => key.includes(group));
  }
}
