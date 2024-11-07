import { Injectable } from '@nestjs/common';
import * as protobuf from 'protobufjs';
import * as path from 'node:path';

import { EventRouterPayload, MockPayload } from '../schemas';
import { CloudEventV1 } from 'cloudevents';

export enum ProtobufKey {
  MockEventMessage = 'MockEventMessage',
  CloudEventMessage = 'CloudEventMessage',
  EventRouterMessage = 'EventRouterMessage',
}

export interface ProtobufSchemaType {
  [ProtobufKey.MockEventMessage]: MockPayload;
  [ProtobufKey.CloudEventMessage]: CloudEventV1<string>;
  [ProtobufKey.EventRouterMessage]: EventRouterPayload;
}

type ProtoSchemaConfig = {
  [K in ProtobufKey]: { file: string; messageType: string };
};

@Injectable()
export class ProtobufService {
  private schemas: { [key: string]: protobuf.Type } = {};
  private readonly schemaConfig: ProtoSchemaConfig = {
    [ProtobufKey.MockEventMessage]: {
      file: 'mockEventMessage.proto',
      messageType: 'MockEventMessage',
    },
    [ProtobufKey.CloudEventMessage]: {
      file: 'cloudEvent.proto',
      messageType: 'CloudEvent',
    },
    [ProtobufKey.EventRouterMessage]: {
      file: 'eventRouterMessage.proto',
      messageType: 'google.events.cloud.firestore.v1.DocumentEventData',
    },
  };

  constructor() {
    this.loadSchemas();
  }

  private loadSchemas(): void {
    function getSchemaPath(schemaFile: string): string {
      return path.join(__dirname, 'assets', 'proto', `${schemaFile}`);
    }

    Object.entries(this.schemaConfig).forEach(([key, value]) => {
      const loadedSchema = protobuf.loadSync(getSchemaPath(value.file));
      this.schemas[key] = loadedSchema.root.lookupType(value.messageType);
    });
  }

  decode<K extends ProtobufKey>(schema: K, data: Buffer) {
    const decodedData = this.schemas[schema].decode(data);

    // TODO: Support integers larger than 53bit
    return decodedData.$type.toObject(decodedData, { longs: Number });
  }

  encode<K extends ProtobufKey>(
    schema: K,
    data: ProtobufSchemaType[K]
  ): Buffer {
    const encodedData = this.schemas[schema].encode(data).finish();
    return Buffer.from(encodedData);
  }
}
