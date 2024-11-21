import { Expose } from 'class-transformer';
import {
  CTCart,
  LineItem,
} from '@cw/cart-service/types/commercetools-cart.type';
import { ShippingPriceEntity, ValueWrapper } from './price.entity';

export class TotalsEntity {
  @Expose()
  subtotal: ValueWrapper;
  @Expose()
  shipping: ShippingPriceEntity[];
  @Expose()
  total: ValueWrapper;
  @Expose()
  savings: ValueWrapper;

  constructor(partial: Partial<TotalsEntity>) {
    Object.assign(this, partial);
  }

  static fromCart(cart: CTCart): TotalsEntity {
    const currencyCode = cart.totalPrice.currencyCode;
    const shippingPrices = this.calculateShippingTotal(cart);
    const totals = {
      subtotal: new ValueWrapper(
        this.calculateSubtotal(cart.lineItems),
        2,
        currencyCode
      ),
      shipping: ShippingPriceEntity.fromCart(shippingPrices),
      savings: new ValueWrapper(this.calculateSavings(cart), 2, currencyCode),
      total: new ValueWrapper(
        cart.totalPrice.centAmount,
        cart.totalPrice.fractionDigits,
        cart.totalPrice.currencyCode
      ),
    };

    return new TotalsEntity(totals);
  }

  static calculateTotalLineitemPrice(lineItem) {
    const total = {
      amount: lineItem.totalPrice.centAmount,
      currencyCode: lineItem.totalPrice.currencyCode,
    };
    return total;
  }

  static calculateSubtotal(lineItems: LineItem[]) {
    if (!lineItems.length) {
      return 0;
    }
    const lineItemTotals = lineItems.map((lineItem) =>
      this.calculateTotalLineitemPrice(lineItem)
    );
    const subtotal = lineItemTotals.reduce(
      (initialSubtotal, lineItemSubtotal) => {
        return {
          amount: Number(
            (lineItemSubtotal.amount + initialSubtotal.amount).toFixed(2)
          ),
          currencyCode: initialSubtotal.currencyCode,
        };
      }
    );
    return subtotal.amount;
  }

  static calculateShippingTotal(cart: CTCart) {
    const cartShipping = cart.shipping.reduce((acc, field) => {
      acc[field.shippingKey] = field.shippingInfo.shippingMethodName;
      return acc;
    }, {});
    const shippingPrices = [];

    for (const lineItem of cart.customLineItems) {
      if (
        lineItem.shippingDetails === undefined ||
        !lineItem.shippingDetails.valid
      ) {
        continue;
      }

      for (const target of lineItem.shippingDetails.targets) {
        shippingPrices.push({
          key: target.shippingMethodKey,
          name: cartShipping[target.shippingMethodKey],
          value: {
            amount: lineItem.totalPrice.centAmount,
            currencyCode: lineItem.totalPrice.currencyCode,
            fractionDigits: lineItem.totalPrice.fractionDigits,
          },
        });
      }
    }
    return shippingPrices;
  }

  static calculateSavings(cart: CTCart) {
    let savingAmount = 0;
    const { lineItems, discountOnTotalPrice } = cart;

    // RRP will be the main price for savings, otherwise use the product price
    // savings = (main price * quantity) - (line item total price)
    for (const lineItem of lineItems) {
      const lineItemTotalPrice = lineItem.totalPrice.centAmount;
      const priceCustomFields = lineItem.price.custom
        ? lineItem.price.custom.customFieldsRaw
        : [];

      const rrp = priceCustomFields.find((field) => field.name === 'rrp');

      if (rrp) {
        // Only add savings if rrp is set
        const rrpPrice = lineItem.quantity * rrp.value.centAmount;

        // discounted price needs to be subtracted from rrp or price
        const saving = rrpPrice - lineItemTotalPrice;
        if (saving < 0) {
          continue;
        }
        savingAmount += saving;
      } else {
        const productPrice =
          lineItem.quantity * lineItem.price.value.centAmount;
        const saving = productPrice - lineItemTotalPrice;
        if (saving < 0) {
          continue;
        }
        savingAmount += saving;
        continue;
      }
    }

    if (discountOnTotalPrice) {
      savingAmount += discountOnTotalPrice.discountedAmount.centAmount;
    }

    const savings = {
      value: {
        amount: Number(savingAmount.toFixed(2)),
        currencyCode: lineItems.length
          ? lineItems[0].totalPrice.currencyCode
          : null,
      },
    };
    return savings.value.amount;
  }
}
