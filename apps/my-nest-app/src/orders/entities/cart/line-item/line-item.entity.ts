import { Expose } from 'class-transformer';
import {
  CTCart,
  LineItem,
} from '@cw/cart-service/types/commercetools-cart.type';
import { GroupEntity } from './group.entity';
import { ImageEntity } from './image.entity';
import { UnitPriceEntity } from './unit-price.entity';
import { LineItemTotalEntity } from './line-item-total.entity';
import { DetailEntity } from './detail.entity';
import { MessageEntity } from './message.entity';
import { AttributeEntity } from './attribute.entity';
import { transformValueByLocale } from '@cw/cart-service/utils/commercetools.utils';



export class LineItemEntity {
  locale: string;
  @Expose()
  id: string;
  @Expose()
  name: string;
  @Expose()
  sku: string;
  @Expose()
  quantity: number;
  @Expose()
  group: GroupEntity;
  @Expose()
  image: ImageEntity;
  @Expose()
  productType: string;
  @Expose()
  unitPrice: UnitPriceEntity;
  @Expose()
  attributes: AttributeEntity[];
  @Expose()
  totals: LineItemTotalEntity;
  @Expose()
  details: DetailEntity;
  @Expose()
  messages: MessageEntity[];
  @Expose()
  key: string;
  @Expose()
  giftLineItem: boolean;

  constructor(partial: Partial<LineItemEntity>) {
    Object.assign(this, partial);
  }

  static fromCart(
    cart: CTCart,
    locale: string,
    mask: boolean
  ): LineItemEntity[] {
    if (cart.lineItems.length == 0) {
      return [];
    }

    return cart.lineItems.reverse().map(
      (lineItem: LineItem) =>
        new LineItemEntity({
          id: lineItem.id,
          key: lineItem.key,
          name:
            this.getVariantNameAttribute(lineItem, locale) ??
            transformValueByLocale(lineItem.nameAllLocales, locale),
          sku: lineItem.variant.sku,
          quantity: lineItem.quantity,
          group: new GroupEntity(lineItem, locale),
          image: new ImageEntity(lineItem.variant.images),
          productType: lineItem.productType.key,
          unitPrice: new UnitPriceEntity(lineItem.price),
          attributes: this.transformAttributes(lineItem, locale),
          totals: new LineItemTotalEntity(
            lineItem.totalPrice,
            lineItem.price.value,
            lineItem.quantity
          ),
          details: new DetailEntity(lineItem, mask),
          messages: this.transformMessages(lineItem),
          giftLineItem: lineItem.lineItemMode === 'GiftLineItem' ? true : false,
        })
    );
  }

  static transformAttributes(lineItem: LineItem, locale: string) {
    const attributes = [];
    for (const attribute of lineItem.variant.attributesRaw) {
      if (
        attribute.name !== 'cwr-transaction-limit' &&
        attribute.name !== 'cwr-purchase-limit' &&
        attribute.name !== 'cwr-product-flags'
      ) {
        continue;
      }
      attributes.push(
        new AttributeEntity({
          name: transformValueByLocale(
            attribute.attributeDefinition.labelAllLocales,
            locale
          ),
          key: attribute.name,
          value:
            attribute.name === 'cwr-product-flags'
              ? (attribute.value as string[])
              : Number(attribute.value),
        })
      );
    }
    return attributes;
  }

  static transformMessages(lineItem) {
    const messages = [];
    if (!lineItem.custom) {
      return messages;
    }

    const transactionLimitStatus = lineItem.custom.customFieldsRaw.find(
      (field) => field.name === 'cwr-transaction-limit-status'
    );
    const purchaseLimitStatus = lineItem.custom.customFieldsRaw.find(
      (field) => field.name === 'cwr-purchase-limit-status'
    );

    if (transactionLimitStatus && transactionLimitStatus.value === 'Enforced') {
      messages.push(
        new MessageEntity({
          code: 'qty_transaction_enforced',
          level: 'warning',
        })
      );
    }

    if (purchaseLimitStatus) {
      if (purchaseLimitStatus.value === 'Enforced') {
        messages.push(
          new MessageEntity({ code: 'qty_purchase_enforced', level: 'warning' })
        );
      } else if (purchaseLimitStatus.value === 'Exceeded') {
        messages.push(
          new MessageEntity({ code: 'qty_purchase_exceeded', level: 'error' })
        );
      }
    }

    // TODO Quantity unavailable
    return messages;
  }

  static getVariantNameAttribute(lineItem: LineItem, locale: string) {
    for (const attribute of lineItem.variant.attributesRaw) {
      if (attribute.name == 'cwr-variant-name') {
        return attribute.value[locale] || attribute.value['en'];
      }
    }
    return undefined;
  }
}
