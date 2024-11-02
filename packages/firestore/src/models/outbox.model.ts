import { DocumentData, Timestamp } from '@google-cloud/firestore';

export interface OutboxDocument extends DocumentData {
  event_body: string;
  created: Timestamp;
  expire_at: Timestamp;
  name: string
}
