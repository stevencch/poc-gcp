import { Injectable } from '@nestjs/common';
import { CloudEvent } from 'cloudevents';

import {
  MockPayload,
  SchemaKey,
  EventRouterPayload,
  OutboxItem_WIP,
} from '../schemas';

export enum CloudEventTypes {
  MockImportEvent = 'com.cwretail.catalogue.mock.update.v1',
  NewAdminImportEvent = 'com.cwretail.catalogue.newadmin.update.v1',
  ProductInformationImportEvent = 'com.cwretail.catalogue.productinformation.update.v1',
  PimsImportEvent = 'com.cwretail.catalogue.pims.update.v1',
  OutboxEvent = 'com.cwretail.catalogue.outbox.update.v1',
  ProductWrittenEvent = 'com.cwretail.catalogue.productwritten.update.v1',
}

export interface CloudEventTypesMap {
  [CloudEventTypes.MockImportEvent]: MockPayload;
  [CloudEventTypes.OutboxEvent]: OutboxItem_WIP;
}

const cloudEventSchemaMap = new Map<CloudEventTypes, SchemaKey>([
  [CloudEventTypes.MockImportEvent, SchemaKey.Mock],
  [CloudEventTypes.NewAdminImportEvent, SchemaKey.NewAdminImportPayload],
  [
    CloudEventTypes.ProductInformationImportEvent,
    SchemaKey.ProductInformationImportPayload,
  ],
  [CloudEventTypes.PimsImportEvent, SchemaKey.PimsImportPayload],
  [CloudEventTypes.OutboxEvent, SchemaKey.OutboxItemPayload],
]);

@Injectable()
export class CloudEventService {
  constructor() {}

  public extractData<T extends keyof CloudEventTypesMap>(
    event: unknown,
    eventType: T
  ): CloudEventTypesMap[T] {
    const cloudEvent = new CloudEvent(event as CloudEvent<string>, true);

    if (cloudEvent.type !== eventType) {
      throw new Error(`Invalid event type: ${cloudEvent.type}`);
    }

    const schemaKey = cloudEventSchemaMap.get(eventType);

    if (!schemaKey) {
      throw new Error(`Schema not found for event type: ${cloudEvent.type}`);
    }

    if (!cloudEvent.data) {
      throw new Error('Missing data attribute in CloudEvent');
    }

    const parsedData = JSON.parse(cloudEvent.data);



    return parsedData as CloudEventTypesMap[T];
  }

  public static createEvent<T extends keyof CloudEventTypesMap>(
    eventType: T,
    source: string,
    data: CloudEventTypesMap[T]
  ): CloudEvent<string> {
    return new CloudEvent({
      type: eventType,
      source: source,
      data: JSON.stringify(data),
      datacontenttype: 'application/json',
    });
  }
}
