import { Expose, Transform } from 'class-transformer';
import { CustomerEntity } from './customer/customer.entity';
import { DiscountCode } from './discount/discount-code.entity';
import { MarketingEntity } from './marketing/marketing.entity';
import { TotalsEntity } from './totals/totals.entity';
import { LineItemEntity } from './line-item/line-item.entity';
import { ShippingEntity } from './shipping/shipping.entity';
import { OrderEntity } from './order.entity';
import { BillingAddressEntity } from './billing-address/billing-address.entity';
import { CTCart } from '@cw/cart-service/types/commercetools-cart.type';

export const GUEST_CART_PII_EXPIRY = 300;

export class CartEntity {
  @Expose()
  id: string;
  @Expose()
  version: number;
  locale: string;

  @Expose({ name: 'state' })
  @Transform(
    ({ obj }) =>
      obj.custom?.customFieldsRaw.find(({ name }) => name === 'cwr-state')
        ?.value
  )
  state: string;

  @Expose({ name: 'currency' })
  @Transform(({ obj }) => obj.totalPrice.currencyCode)
  currency: string;

  @Expose({ name: 'details' })
  @Transform(({ obj }) =>
    CartEntity.isDataMaskingRequired(obj.lastModifiedAt) && !obj.customerId
      ? {
          email: null,
          firstName: null,
          lastName: null,
          mobile: null,
        }
      : CustomerEntity.fromCart(obj)
  )
  details: CustomerEntity;

  @Expose({ name: 'discountCodes' })
  @Transform(({ obj }) => DiscountCode.fromCart(obj))
  dc: DiscountCode[];

  @Expose({ name: 'marketing' })
  @Transform(({ obj }) => MarketingEntity.fromCart(obj))
  marketing: MarketingEntity;

  @Expose({ name: 'totals' })
  @Transform(({ obj }) => TotalsEntity.fromCart(obj))
  totals: TotalsEntity;

  @Expose({ name: 'items' })
  @Transform(({ obj }) =>
    LineItemEntity.fromCart(
      obj,
      obj.locale,
      CartEntity.isDataMaskingRequired(obj.lastModifiedAt) && !obj.customerId
        ? true
        : false
    )
  )
  items: LineItemEntity[];

  @Expose({ name: 'shipping' })
  @Transform(({ obj }) =>
    CartEntity.isDataMaskingRequired(obj.lastModifiedAt) && !obj.customerId
      ? []
      : ShippingEntity.fromCart(obj, obj.locale)
  )
  shippingEntity: ShippingEntity[];

  @Expose()
  @Transform(({ obj }) =>
    obj.cartState === 'Ordered'
      ? new OrderEntity({ orderNumber: obj.key })
      : undefined
  )
  order?: OrderEntity;

  @Expose({ name: 'paymentMethods' })
  @Transform(({ obj }) =>
    obj.cartState === 'Ordered' ? CartEntity.getPaymentMethods(obj) : undefined
  )
  paymentMethods: string[];

  @Expose({ name: 'billingAddress' })
  @Transform(({ obj }) => BillingAddressEntity.fromCart(obj))
  billingEntity: BillingAddressEntity;

  constructor(cart: Partial<CartEntity>, locale: string) {
    Object.assign(this, cart);
    this.locale = locale;
  }

  static isDataMaskingRequired(lastModifiedAt: string) {
    const lastUpdateTime = new Date(lastModifiedAt).getTime();
    const currentTime = new Date().getTime();
    const diff = (currentTime - lastUpdateTime) / 1000;
    return diff >= GUEST_CART_PII_EXPIRY;
  }

  isInvalid() {
    return this.state === 'ShippingInvalid';
  }

  static getPaymentMethods(cart: CTCart) {
    return cart.paymentInfo.payments.map(
      (payment) => payment.paymentMethodInfo.method
    );
  }
}
