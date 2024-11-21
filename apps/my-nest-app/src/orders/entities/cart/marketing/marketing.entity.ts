import { Expose } from 'class-transformer';
import { CTCart, CustomField } from '@cw/cart-service/types/commercetools-cart.type';

export class MarketingEntity {
  @Expose()
  smsOptIn: boolean;

  @Expose()
  emailOptIn: boolean;

  constructor(partial: Partial<MarketingEntity>) {
    Object.assign(this, partial);
  }

  static fromCart(cart: CTCart): MarketingEntity {
    const marketing = {
      smsOptIn: false,
      emailOptIn: false,
    };

    if (cart.custom) {
      cart.custom.customFieldsRaw.forEach((field: CustomField) => {
        switch (field.name) {
          case 'cwr-marketing-sms-opt-in':
            marketing.smsOptIn = field.value;
            break;
          case 'cwr-marketing-email-opt-in':
            marketing.emailOptIn = field.value;
            break;
        }
      });
    }

    return new MarketingEntity(marketing);
  }
}
