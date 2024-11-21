import { Expose } from 'class-transformer';
import { Shipping } from '@cw/cart-service/types/commercetools-cart.type';

class ChannelEntity {
  @Expose()
  key: string;

  constructor(partial: Partial<ChannelEntity>) {
    Object.assign(this, partial);
  }
}

class CollectorEntity {
  @Expose()
  collectorFirstName: string;
  @Expose()
  collectorLastName: string;

  constructor(partial: Partial<CollectorEntity>) {
    Object.assign(this, partial);
  }
}

export class CollectionEntity {
  @Expose()
  channel: ChannelEntity;
  @Expose()
  collector: CollectorEntity;

  constructor(partial: Partial<CollectionEntity>) {
    Object.assign(this, partial);
  }

  static fromShipping(shipping: Shipping) {
    const shippingCustomFields = this.transformCustomFields(shipping);
    const supplyChannels = shippingCustomFields['cwr-supply-channels']
      ? JSON.parse(shippingCustomFields['cwr-supply-channels'])
      : [];

    let channelKey = '';
    for (const supplyChannel of supplyChannels) {
      channelKey = supplyChannel.channelKey;
    }

    return new CollectionEntity({
      channel: new ChannelEntity({
        key: channelKey,
      }),
      collector: new CollectorEntity({
        collectorFirstName: shipping.shippingAddress.firstName,
        collectorLastName: shipping.shippingAddress.lastName
      }),
    });
  }

  static transformCustomFields(shipping: Shipping) {
    return shipping.shippingCustomFields.customFieldsRaw.reduce(
      (acc, field) => {
        acc[field.name] = field.value;
        return acc;
      },
      {}
    );
  }
}
