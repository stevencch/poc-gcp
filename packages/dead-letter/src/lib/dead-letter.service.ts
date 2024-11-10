import { Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ErrorType } from '@poc-gcp/common';
import { PubSubService } from '@poc-gcp/pubsub';
import deadLetterConfig from './dead-letter.config';
import { ConfigType } from '@nestjs/config';

export type DeadLetterPublishBody<T = unknown> = {
  message: {
    attributes: T & {
      [key: string]: string;
    };
    data: string;
  };
  subscription: string;
};

@Injectable()
export class DeadLetterService {
  private readonly logger = new Logger(DeadLetterService.name);

  constructor(
    private readonly pubSubService: PubSubService,
    @Inject(deadLetterConfig.KEY)
    private readonly config: ConfigType<typeof deadLetterConfig>
  ) {}

  async publishToDeadLetter(
    error: { type: ErrorType; message: string },
    body: DeadLetterPublishBody
  ) {
    const errorMessageId = uuidv4();
    const errorMessage = `[${errorMessageId}] ${error.message}`;
    const sourceSubscriptionId = body.subscription.split('/subscriptions/')[1];
    const attributes = {
      ...body.message.attributes,
      CloudPubSubDeadLetterSourceSubscription: sourceSubscriptionId,
      errorType: error.type,
      errorMessage,
      errorMessageId,
    };

    this.logger.error(errorMessage);
    await this.pubSubService.publishMessage(
      this.config.deadLetterTopic,
      Buffer.from(body.message.data, 'base64'),
      attributes
    );
  }
}
