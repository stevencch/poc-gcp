import { Expose } from 'class-transformer';
import { MessageEntity } from '../line-item/message.entity';

export class ItemMessageEntity {
  @Expose()
  itemId: string;
  @Expose()
  messages: MessageEntity[];

  constructor(partial: Partial<ItemMessageEntity>) {
    Object.assign(this, partial);
  }

  static fromCustom(customField, lineItemMap) {
    const messages = JSON.parse(customField['cwr-item-messages']);
    const itemMessages: ItemMessageEntity[] = [];
    for (const message of messages) {
      itemMessages.push(new ItemMessageEntity({
        itemId: lineItemMap[message.sku] ? lineItemMap[message.sku].id : message.sku,
        messages: [new MessageEntity({
          code: message.code,
          level: message.level,
          message: message.message,
        })],
      }));
    }
    return itemMessages;
  }
}
