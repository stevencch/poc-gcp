import { LineItemMode } from '@commercetools/platform-sdk';

export type CTCart = {
  id: string;
  key: string | null;
  version: number;
  lastModifiedAt: string;
  cartState: 'Active' | 'Merged' | 'Ordered' | 'Frozen';
  customerEmail: string | null;
  customerId: string | null;
  store: Store;
  itemShippingAddresses: ItemShippingAddress[] | null;
  customLineItems: CustomLineItem[];
  billingAddress: Address;
  lineItems: LineItem[];
  shipping?: Shipping[];
  totalPrice: Price;
  discountOnTotalPrice: DiscountOnTotalPrice;
  discountCodes: DiscountCode[];
  paymentInfo: PaymentInfo;
  custom?: CustomFields;
};

export type DiscountOnTotalPrice = {
  discountedAmount: Price;
};

export type ItemShippingAddress = {
  key: string;
};

export type CustomLineItem = {
  id: string;
  key: string;
  shippingDetails: ShippingDetails | null;
  totalPrice: Price;
  discountedPricePerQuantity: DiscountedPricePerQuantity[];
};

export type Address = {
  firstName: string;
  lastName: string;
  building: string;
  streetNumber: string;
  streetName: string;
  postalCode: string;
  city: string;
  state: string;
  email: string;
  country: string;
  phone?: string;
  mobile?: string;
};

export type LineItem = {
  id: string;
  key: string;
  priceMode: 'Platform' | 'ExternalPrice' | 'ExternalTotal';
  nameAllLocales: LocaleValue[];
  productSlugAllLocales: LocaleValue[];
  productType: ProductType;
  lineItemMode: LineItemMode;
  variant: Variant;
  quantity: number;
  discountedPricePerQuantity: DiscountedPricePerQuantity[];
  price: PriceDetails;
  totalPrice: Price;
  supplyChannel?: SupplyChannel;
  shippingDetails?: ShippingDetails;
  custom?: CustomFields;
};

export type LocaleValue = {
  locale: string;
  value: string;
};

export type ProductType = {
  key: string;
};

export type ScheduledTypeAttributes = {
  key: string;
  label: string;
};

export type Attributes = {
  name: string;
  value: string | string[] | number | ScheduledTypeAttributes[];
  attributeDefinition: AttributeDefinition;
};

export type AttributeDefinition = {
  labelAllLocales: LocaleValue[];
};

export type Variant = {
  sku: string;
  images: Image[];
  prices?: PriceDetails[];
  attributesRaw?: Attributes[];
};

export type Image = {
  label: string;
  url: string;
  dimensions: Dimensions;
};

export type Dimensions = {
  height: number;
  width: number;
};

export type PriceDetails = {
  value?: Price;
  custom?: CustomFields;
  discounted?: DiscountedPriceDetails;
};

export type DiscountedPriceDetails = {
  value: Price;
};

export type Price = {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
};

export type DiscountedPrice = {
  value: Price;
  includedDiscounts: IncludedDiscounts[];
};

export type IncludedDiscounts = {
  // value: Price;
  discount: Discount;
  discountedAmount: Price;
};

export type Discount = {
  nameAllLocales: LocaleValue[];
  key: string;
  id: string;
  custom: CustomFields;
};

export type DiscountedPricePerQuantity = {
  discountedPrice: DiscountedPrice;
  quantity: number;
};

export type SupplyChannel = {
  id: string;
  key: string;
  nameAllLocales: LocaleValue[];
  custom?: CustomFields;
};

export type ShippingDetails = {
  targets: ShippingTarget[];
  valid: boolean;
};

export type ShippingTarget = {
  addressKey: string;
  quantity: number;
  shippingMethodKey: string;
};

export type Shipping = {
  shippingKey: string;
  shippingAddress: ShippingAddress;
  shippingInfo: ShippingInfo;
  shippingCustomFields: CustomFields;
};

export type ShippingAddress = {
  key: string;
  building: string;
  streetNumber: string;
  streetName: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  additionalAddressInfo: string;
  custom?: CustomFields;
  firstName: string;
  lastName: string;
  phone?: string;
};

export type ShippingInfo = {
  shippingMethodName: string;
  price: Price;
};

export type DiscountCode = {
  discountCode: Code;
  state: string;
};

export type Code = {
  id: string;
  code: string;
};

export type CustomFields = {
  type?: CustomType;
  customFieldsRaw?: CustomField[];
};

export type CustomType = {
  key: string;
};

export type CustomField = {
  name: string;
  value;
};

export type Store = {
  key: string;
};

export type PaymentMethodInfo = {
  method: string;
  nameAllLocales: LocaleValue[];
};

export type Transaction = {
  type:
    | 'Authorization'
    | 'CancelAuthorization'
    | 'Refund'
    | 'Charge'
    | 'Chargeback';
  state: 'Initial' | 'Pending' | 'Success' | 'Failure';
};

export type Payment = {
  key: string;
  createdAt: string;
  amountPlanned: Price;
  paymentMethodInfo: PaymentMethodInfo;
  transactions: Transaction[];
  custom: CustomFields;
};

export type PaymentInfo = {
  payments: Payment[];
};
