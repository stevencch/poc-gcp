import { Expose } from 'class-transformer';
import { MethodEntity } from './method.entity';
import { AddressEntity } from './address.entity';
import { CollectionEntity } from './collection.entity';
import { CTCart, LineItem } from '@cw/cart-service/types/commercetools-cart.type';
import { ShippingGroup } from '@cw/cart-service/dto/update-cart.dto';

export class ShippingEntity {
  locale: string;
  @Expose()
  group: string;
  @Expose()
  isApplied: boolean;
  @Expose()
  methods: MethodEntity[];
  @Expose()
  address: AddressEntity;
  @Expose()
  collection: CollectionEntity;

  constructor(partial: Partial<ShippingEntity>) {
    Object.assign(this, partial);
  }

  static fromCart(cart: CTCart, locale: string): ShippingEntity[] {
    const cartShippings: ShippingEntity[] = [];
    if (!cart.shipping) {
      return cartShippings;
    }
    
    if (cart.shipping.length == 0) {
      return cartShippings;
    }

    const groups = [];
    for (const shipping of cart.shipping) {
      const shippingGroup = this.extractGroup(shipping.shippingKey);
      if (groups.includes(shippingGroup)) {
        continue;
      }
      groups.push(shippingGroup);
      cartShippings.push(
        new ShippingEntity({
          group: this.extractGroup(shippingGroup),
          isApplied: this.checkAppliedStatus(
            cart.lineItems,
            shippingGroup
          ),
          methods: MethodEntity.fromShipping(cart, shippingGroup, locale),
          address: AddressEntity.fromShipping(shipping),
          collection: shippingGroup.startsWith('click')
            ? CollectionEntity.fromShipping(shipping)
            : null,
        })
      );
    }
    return cartShippings;
  }

  static extractGroup(shippingKey: string): ShippingGroup {
    const groups = [
      'fast-delivery',
      'delivery',
      'click-and-collect',
      'digital',
    ];
    return groups.find((group) => shippingKey.includes(group)) as ShippingGroup;
  }

  static checkAppliedStatus(
    cartLineItems: LineItem[],
    shippingGroup: string
  ): boolean {
    for (const lineItem of cartLineItems) {
      if (lineItem.shippingDetails === null) {
        continue;
      }
      if (lineItem.shippingDetails.targets.length > 0) {
        for (const target of lineItem.shippingDetails.targets) {
          if (
            this.checkShippingGroup(target.shippingMethodKey, shippingGroup) &&
            lineItem.shippingDetails.valid
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  static checkShippingGroup(shippingKey, shippingGroup) {
    if (shippingGroup === 'delivery') {
      return !shippingKey.includes('fast-delivery');
    } 
    return shippingKey.includes(shippingGroup);
  }
}
