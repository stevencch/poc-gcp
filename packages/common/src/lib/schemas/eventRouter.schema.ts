import { JSONSchemaType } from 'ajv';

export interface EventRouterPayload {
  value: {
    name: string;
    createTime: { seconds: number; nanos?: number };
    updateTime: { seconds: number; nanos?: number };
    fields: {
      created: { timestampValue: { seconds: number; nanos?: number } };
      expire_at: { timestampValue: { seconds: number; nanos?: number } };
      event_body: { stringValue: string };
    };
  };
}


