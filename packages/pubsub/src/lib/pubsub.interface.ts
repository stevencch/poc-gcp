export interface PubSubReceivedMessage<T = unknown> {
  message: PubSubMessage<T>;
  subscription: string;
}

export interface PubSubMessage<T = unknown> {
  attributes: T & {
    [key: string]: string;
  };
  data: string;
  messageId: string;
  message_id: string;
  publishTime: string;
  publish_time: string;
}
