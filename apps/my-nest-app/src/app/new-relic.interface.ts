import { _Order } from '@commercetools/platform-sdk';


export enum LogType {
  PAYMENT = 'Payment',
  ORDER = 'Order',
  EVENT = 'Event',
  API = 'Api',
}

export type LogSource = string;

export type LogData = {
  eventType: string;
  customAttributes?: Record<string, unknown>;
};

export interface NewRelicLog<T extends LogData> {
  logType: LogType;
  logSource: LogSource;
  logData: T;
}

export interface LogOrder extends LogData {
  orderNumber: string;
  orderState: string;
  shipmentState: string;
  paymentState: string;
  orderWorkflowState: string;
  createdDate: string;
  updatedDate: string;
}




export interface LogEvent extends LogData {
  eventTime: string;
  source: string;
  id: string;
  status: string;
  subject: string;
  error?: NewRelicLogError;
}

export type LogInput<T> = {
  message?: string;
  payload: T;
  status?: LogInputStatus;
  error?: NewRelicLogError;
};



export type NewRelicLogError = {
  status: number;
  code: string;
  title: string;
  detail?: string;
  errors: LogError[];
};

export type LogError = {
  source: number;
  type: string;
  message: string;
  detail?: string;
};

export enum ProcessStatus {
  Successful = 'Successful',
  Failed = 'Failed',
}

export enum LogStatus {
  Published = 'Published',
  Received = 'Received',
  Processed = 'Processed',
  Rejected = 'Rejected',
  Failed = 'Failed',
}

export enum PaymentMode {
  'VOUCHER' = 'Voucher',
  'OTHER' = 'Other',
}

export type LogInputStatus = LogStatus | ProcessStatus;

export interface RemoteAddress {
  port: number;
  ip: string;
  family?: string;
}

interface ApiBase {
  timestamp: string;
  headers: Record<string, unknown>;
  content?: string;
}

export interface ApiRequest extends ApiBase {
  url: string;
  method: string;
  host?: string;
  path?: string;
  httpVersion?: string;
  address?: RemoteAddress;
}

export interface ApiResponse extends ApiBase {
  statusCode: string;
  statusMessage?: string;
}

export interface LogApi extends LogData {
  request: ApiRequest;
  response: ApiResponse;
}
