/* istanbul ignore file */
import { Expose } from 'class-transformer';

export class SessionEntity {
  @Expose()
  uiPayload: string;

  constructor(session: Partial<SessionEntity>) {
    Object.assign(this, session);
  }
}
