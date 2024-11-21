import { Expose } from 'class-transformer';
import { LineItem } from '@cw/cart-service/types/commercetools-cart.type';
import { transformValueByLocale } from '@cw/cart-service/utils/commercetools.utils';



const SCHEDULED_ATTRIBUTE_CODE = '8';

class Seller {
  @Expose()
  name: string;

  constructor(partial: Partial<Seller>) {
    Object.assign(this, partial);
  }
}

export class GroupEntity {
  @Expose()
  groupType: string;
  @Expose()
  code: string;
  @Expose()
  seller: Seller;

  constructor(lineItem: LineItem, locale: string) {
    const group = GroupEntity.transformItemGroup(lineItem, locale);
    Object.assign(this, group);
  }

  static transformItemGroup(lineItem: LineItem, locale: string) {
    if (lineItem.variant.attributesRaw) {
      const scheduledAttribute = lineItem.variant.attributesRaw.find(
        (item) => item.name === 'cwr-au-schedule'
      );

      if (scheduledAttribute) {
        if (
          Array.isArray(scheduledAttribute.value) &&
          scheduledAttribute.value.some(
            (attr) => attr.key === SCHEDULED_ATTRIBUTE_CODE
          )
        ) {
          return {
            groupType: 'generic',
            code: 's8',
          };
        }
      }
    }

    if (lineItem.supplyChannel) {
      const supplyChannelType = lineItem.supplyChannel['custom']
        ? lineItem.supplyChannel['custom'].type.key
        : '';

      if (supplyChannelType === 'cwr-channel-mp-seller') {
        return {
          groupType: 'marketplace',
          code: 'marketplace',
          seller: new Seller({
            name: transformValueByLocale(
              lineItem.supplyChannel.nameAllLocales,
              locale
            ),
          }),
        };
      }
    }

    return {
      groupType: 'default',
      code: 'default',
    };
  }
}
