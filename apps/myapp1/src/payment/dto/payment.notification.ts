export interface ClientNotification {
    version: string;
    notificationData: string;
}

export interface RetryPaymentNotification {
    notification: PaymentNotification;
}

export interface PaymentNotification {
    clientId: string;
    clientReference: string;
    reference: string;
    source: string;
    notificationEvent: NotificationEventType;
    notificationEventStatus: NotificationEventStatus;
    paymentMethods: PaymentMethodResult[];
}

export interface PaymentMethodResult {
    paymentId: string;
    paymentMethodReference: string;
    paymentMethodName: string;
    captureMode?: CaptureMode;
    amount: number;
    currency: string;
    provider: ProviderName;
    providerReference: string;
    status: NotificationEventStatus;
    cardSummary: string;
    operationType: string;
    fraudCheckResult: GpsFraudCheckResult;
}

export interface GpsFraudCheckResult {
    isFraud: boolean;
    providerId: string;
    message: string;
    externalId: string;
}

export enum CaptureMode {
    Automatic = "Automatic",
    Manual = "Manual"
}

export enum NotificationEventType {
    Offer_Closed = "Offer_Closed",
    Pending = "Pending",
    Authorisation = "Authorisation",
    Authorisation_Adjustment = "Authorisation_Adjustment",
    Capture = "Capture",
    Cancellation = "Cancellation",
    Refund = "Refund",
    Unknown = "Unknown",
}

export enum NotificationEventStatus {
    Unknown = "Unknown",
    Pending = "Pending",
    Successful = "Successful",
    Failed = "Failed",
    FraudCheckFailed = "FraudCheckFailed"
}

export enum ProviderName {
    Adyen = "Adyen",
    BrainTree = "BrainTree",
    Worldline = "Worldline"
}

export interface GPSToken {
    token: string;
    expiresOn?: Date;
}

export interface GPSModificationResult {
    Status: RequestStatus;
    Reason: string;
    Results: RequestResult[]
}

export interface RequestResult {
    Provider: ProviderName;
    RawStatus: string;
    Status: RequestStatus;
    ResultCode: string;
    Reason: string;
    AcquirerResultCode: string;
    Amount?: number;
    PaymentMethodReference: string;
}

export enum RequestStatus {
    Unknown = "Unknown",
    Received = "Received",
    Successful = "Successful",
    Failed = "Failed"
}

export class RefundRequest {
    amount: number;
    clientReference: string;
    paymentReference: string;
    requestReference: string;
    source: string
}

export interface PaymentModifyEvent {
    clientReference: string;
    paymentReference: string;
    source: string;
    type:PaymentModifyType;
    amount:number;
}

export enum PaymentModifyType {
    Capture = "Capture",
    Cancellation = "Cancellation",
    Refund = "Refund"
}