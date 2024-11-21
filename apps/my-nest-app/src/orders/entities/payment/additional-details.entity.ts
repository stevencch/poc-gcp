/* istanbul ignore file */

import { Expose } from 'class-transformer';

export class AdditionalDetailsEntity {
  @Expose()
  uiPayload: string;

  @Expose()
  payments;

  constructor(details: Partial<AdditionalDetailsEntity>) {
    Object.assign(this, details);
  }
}
