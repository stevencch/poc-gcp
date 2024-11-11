import { Firestore, Timestamp } from '@google-cloud/firestore';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import firestoreConfig from './firestore.config';
import { ConfigType } from '@nestjs/config';
import { DeadLetterAttributes, Message } from '@poc-gcp/common';

export enum CollectionEnum {
  DEAD_LETTER_MESSAGES = 'dead_letter_messages',
}

@Injectable()
export class FirestoreService implements OnModuleInit {
  private readonly logger = new Logger(FirestoreService.name);
  private db!: Firestore;

  constructor(
    @Inject(firestoreConfig.KEY)
    private readonly config: ConfigType<typeof firestoreConfig>
  ) {}

  async onModuleInit() {
    this.db = new Firestore({
      projectId: this.config.projectId,
      databaseId: this.config.databaseId,
    });
  }

  async insertDeadLetterMessage(
    message: Message<DeadLetterAttributes>
  ): Promise<void> {
    try {
      const deadLetterMessagesRef = this.db.collection(
        CollectionEnum.DEAD_LETTER_MESSAGES
      );

      deadLetterMessagesRef.add({
        message_id: message.messageId,
        source_subscription_id:
          message.attributes.CloudPubSubDeadLetterSourceSubscription,
        message,
        created: Timestamp.now(),
        expire_at: Timestamp.fromMillis(
          Date.now() + this.config.expiryDuration
        ),
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Error while inserting dead letter message: ${error.message}`
        );
      }
      throw error;
    }
  }
}
