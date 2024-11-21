import { Expose } from 'class-transformer';
import { ValueWrapper } from '../totals/price.entity';
import { MessageEntity } from '../line-item/message.entity';
import { ItemMessageEntity } from './item-message.entity';
import { CTCart, LineItem, Shipping } from '@cw/cart-service/types/commercetools-cart.type';
import { ShippingGroup } from '@cw/cart-service/dto/update-cart.dto';


export class MethodEntity {
  @Expose()
  key: string;
  @Expose()
  code: string;
  @Expose()
  name: string;
  @Expose()
  estimate: string;
  @Expose()
  shippingFee: ValueWrapper;
  @Expose()
  messsages: MessageEntity[];
  @Expose()
  eligibleItemIds: string[];
  @Expose()
  appliedItemIds: string[];
  @Expose()
  itemMessages: ItemMessageEntity[];

  constructor(partial: Partial<MethodEntity>) {
    Object.assign(this, partial);
  }

  static fromShipping(
    cart: CTCart,
    shippingGroup: ShippingGroup,
    locale: string
  ) {
    const methods: MethodEntity[] = [];
    const lineItemMap = this.lineItemMap(cart.lineItems);

    for (const shipping of cart.shipping) {
      if (!shipping.shippingKey.startsWith(shippingGroup)) {
        continue;
      }
      const shippingCustomFields = this.transformCustomFields(shipping);
      const shippingPrice = shippingCustomFields['cwr-shipping-rate'];
      const eligibleItemIds = this.checkEligibleItemIds(shippingCustomFields, lineItemMap);
      const appliedItemIds = this.checkAppliedStatus(cart.lineItems, shipping.shippingKey);
      methods.push(
        new MethodEntity({
          key: shipping.shippingKey,
          code: shippingCustomFields['cwr-method-code'],
          name: shipping.shippingInfo.shippingMethodName,
          estimate: shippingCustomFields['cwr-delivery-estimate'][locale] ? JSON.parse(
            shippingCustomFields['cwr-delivery-estimate'][locale]
          ) : null,
          shippingFee: new ValueWrapper(
            shippingPrice['centAmount'],
            shippingPrice['fractionDigits'],
            shippingPrice['currencyCode']
          ),
          eligibleItemIds: eligibleItemIds.filter(item => !appliedItemIds.includes(item)),
          appliedItemIds: appliedItemIds,
          itemMessages: ItemMessageEntity.fromCustom(shippingCustomFields, lineItemMap)
        })
      );
    }
    return methods;
  }

  static checkAppliedStatus(cartLineItems: LineItem[], group) {
    const appliedItemIds = new Set<string>()
    for (const lineItem of cartLineItems) {
      if (lineItem.productType.key === 'cwr-gift-card' && group.includes('digital')) {
        appliedItemIds.add(lineItem.id);
      }
      if (lineItem.shippingDetails === null) {
        continue;
      }
      for (const target of lineItem.shippingDetails.targets) {
        if (target.shippingMethodKey === group) {
          appliedItemIds.add(lineItem.id);
        }
      }
    }
    return Array.from(appliedItemIds);
  }

  static lineItemMap(lineItems: LineItem[]) {
    return lineItems.reduce((acc, lineItem) => {
      acc[lineItem.variant.sku] = {
        id: lineItem.id,
        supplyChannel: lineItem.supplyChannel
          ? lineItem.supplyChannel.key
          : null,
      };
      return acc;
    }, {});
  }

  static checkEligibleItemIds(shippingCustomFields, lineItemMap) {
    const eligibleItemIds = [];
    const supplyChannels = JSON.parse(
      shippingCustomFields['cwr-supply-channels']
    );
    for (const channel of supplyChannels) {
      for (const sku of channel.skus) {
        if (sku in lineItemMap) {
          eligibleItemIds.push(lineItemMap[sku].id);
        }
      }
    }
    return eligibleItemIds;
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
