import { Expose } from 'class-transformer';

export class MessageEntity {
  @Expose()
  code: string;
  @Expose()
  level: string;
  @Expose()
  message: string;

  constructor(partial: Partial<MessageEntity>) {
    Object.assign(this, partial);
  }
}
