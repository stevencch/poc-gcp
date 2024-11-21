import { Expose } from 'class-transformer';
import { LineItem } from '@cw/cart-service/types/commercetools-cart.type';

export class DetailEntity {
  @Expose()
  itemType: string;
  @Expose()
  recipientEmail: string;
  @Expose()
  recipientName: string;
  @Expose()
  deliveryDate: string;
  @Expose()
  senderName: string;
  @Expose()
  message: string;
  @Expose()
  profileId: string;

  constructor(lineItem: LineItem, mask: boolean) {
    if (lineItem.custom) {
      if (lineItem.custom.type.key === 'cwr-gift-card-line-item') {
        if (mask) {
          return null;
        }
        this.itemType = 'gift-card';
        const giftCardFields = lineItem.custom.customFieldsRaw;
        for (const field of giftCardFields) {
          switch (field.name) {
            case 'cwr-gift-card-recipient-email':
              this.recipientEmail = field.value;
              break;
            case 'cwr-gift-card-recipient-name':
              this.recipientName = field.value;
              break;
            case 'cwr-gift-card-delivery-date':
              this.deliveryDate = field.value;
              break;
            case 'cwr-gift-card-sender-name':
              this.senderName = field.value;
              break;
            case 'cwr-gift-card-message':
              this.message = field.value;
              break;
            default:
              continue;
          }
        }
      } else if (lineItem.custom.type.key === 'cwr-scheduled-line-item') {
        if (mask) {
          return null;
        }
        const scheduledItemFields = lineItem.custom.customFieldsRaw;
        this.itemType = 'scheduled';
        for (const field of scheduledItemFields) {
          switch (field.name) {
            case 'cwr-scheduled-patient-profile-id':
              this.profileId = field.value;
              break;
            default:
              continue;
          }
        }
      }
    }
  }
}
