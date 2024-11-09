import { protos, PublishOptions, PubSub } from '@google-cloud/pubsub';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PubSubReceivedMessage } from './pubsub.interface';
import { isRunningLocally } from '@poc-gcp/vault';

@Injectable()
export class PubSubService {
  private readonly logger = new Logger(PubSubService.name);
  private client: PubSub;
  publishOptions?: PublishOptions;
  constructor() {
    if (isRunningLocally()) {
      this.publishOptions = { gaxOpts: { timeout: 3000 } };
      this.client = new PubSub({
        apiEndpoint: process.env['PUBSUB_EMULATOR_HOST'],
        projectId: process.env['PROJECT_ID'],
        emulatorMode: true,
      });
    } else {
      this.client = new PubSub();
    }
  }

  extractPubSubMessage<T extends PubSubReceivedMessage>(body: T): T['message'] {
    if (!body?.message) {
      throw new HttpException(
        `Invalid GCP Pub/Sub body/message format: ${JSON.stringify(body)}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return body.message;
  }

  async publishMessage(topicId: string, dataBuffer: Buffer, attributes?: { [key: string]: string }): Promise<string> {
    try {
      return await this.client.topic(topicId).publishMessage({ data: dataBuffer, attributes });
    } catch (e) {
      this.logger.error(e);
      throw new Error(`Failed to publish message to topic: "${topicId}"`);
    }
  }

  constructPublishUrl(projectId: string, topicId: string): string {
    if (isRunningLocally()) {
      return `http://${process.env['PUBSUB_EMULATOR_HOST']}/v1/projects/${projectId}/topics/${topicId}:publish`;
    }
    return `https://pubsub.googleapis.com/v1/projects/${projectId}/topics/${topicId}:publish`;
  }

  static constructPublishBody(
    data: string[]
  ): protos.google.pubsub.v1.IPublishRequest {
    return {
      messages: data.map((d) => ({
        data: d,
      })),
    };
  }
}
