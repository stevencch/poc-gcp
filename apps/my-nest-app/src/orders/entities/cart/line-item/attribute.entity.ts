import { Expose } from 'class-transformer';

export class AttributeEntity {
  @Expose()
  name: string;
  @Expose()
  key: string;
  @Expose()
  value: number | string[];

  constructor(attribute: Partial<AttributeEntity>) {
    Object.assign(this, attribute);
  }
}
