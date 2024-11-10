export interface ReceivedMessage<T = unknown> {
  message: Message<T>;
  subscription: string;
}

export interface DeadLetterAttributes {
  CloudPubSubDeadLetterSourceSubscription: string;
}

export interface Message<T = unknown> {
  attributes: T & Attributes;
  data: string;
  messageId: string;
  message_id: string;
  publishTime: string;
  publish_time: string;
}

interface Attributes {
  [k: string]: string;
}
