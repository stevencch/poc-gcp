import { DocumentData, Timestamp } from '@google-cloud/firestore';
import { Message, DeadLetterAttributes } from '@cwr-gcp-common/common';

export interface DeadLetterMessagesDocument extends DocumentData {
  id: string;
  message_id: string;
  source_subscription_id: string;
  message: Message<DeadLetterAttributes>;
  created: Timestamp;
  expire_at: Timestamp;
}
