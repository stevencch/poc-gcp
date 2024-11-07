export * from './mock.schema';

export * from './outbox.schema';
export * from './eventRouter.schema';

import { MockPayload } from './mock.schema';
import { EventRouterPayload } from './eventRouter.schema';
import { OutboxItem_WIP } from './outbox.schema';

export enum SchemaKey {
  Mock = 'mock',
  NewAdminSourceProduct = 'newAdminSourceProduct',
  NewAdminProduct = 'newAdminProduct',
  NewAdminImportPayload = 'newAdminImportPayload',
  ProductInformationSourceProduct = 'productInformationSourceProduct',
  ProductInformationProduct = 'productInformationProduct',
  ProductInformationImportPayload = 'productInformationImportPayload',
  PimsSourceProduct = 'pimsSourceProduct',
  PimsProduct = 'pimsProduct',
  PimsImportPayload = 'pimsImportPayload',
  OutboxItemPayload = 'outboxItem',
  EventRouterPayload = 'eventRouterPayload',
}

export interface SchemaType {
  [SchemaKey.Mock]: MockPayload;
  [SchemaKey.OutboxItemPayload]: OutboxItem_WIP;
  [SchemaKey.EventRouterPayload]: EventRouterPayload;
}
