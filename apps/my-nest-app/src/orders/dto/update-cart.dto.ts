/* istanbul ignore file */


import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  Equals,
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Validate,
  ValidateNested,
} from 'class-validator';

/**
 * Cart DTOs
 */
class Details {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  // TODO: consolidate payload - phone / mobile?
  @IsString()
  mobile: string;
  @IsEmail()
  email: string;
}

export class SetBillingShippingDetails {
  @IsString()
  @MaxLength(100)
  firstName: string;
  @IsString()
  @MaxLength(100)
  lastName: string;
  @IsString()
  country: string;
  @IsString()
  @MaxLength(255)
  streetName: string;
  @IsString()
  @MaxLength(20)
  streetNumber: string;
  @IsString()
  @MaxLength(12)
  postalCode: string;
  @IsString()
  city: string;
  state: string;
  @IsString()
  @IsOptional()
  building: string;
  @IsString()
  @IsOptional()
  phone: string;
  @IsString()
  @IsOptional()
  email: string;
  @IsLatitude()
  latitude;
  @IsLongitude()
  longitude;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  deliveryNotes: string;
}

export class ShippingDetails {
  @IsString()
  country: string;
  @IsString()
  streetName: string;
  @IsString()
  streetNumber: string;
  @IsString()
  postalCode: string;
  @IsString()
  city: string;
  @IsString()
  state: string;
  @IsString()
  @IsOptional()
  building: string;
  @IsString()
  @IsOptional()
  phone: string;
  @IsLatitude()
  latitude;
  @IsLongitude()
  longitude;
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  deliveryNotes: string;
}

export class SetCartDetailsAction {
  @Equals('setCartDetails')
  action: string;

  @ValidateNested()
  @Type(() => Details)
  details: Details;
}

class Preferences {
  @IsBoolean()
  emailOptIn: boolean;
  @IsBoolean()
  smsOptIn: boolean;
}

export class SetCartMarketingPreferencesAction {
  @Equals('setCartMarketingPreferences')
  action: string;

  @ValidateNested()
  @Type(() => Preferences)
  preferences: Preferences;
}

export class AddDiscountCodeAction {
  @Equals('addDiscountCode')
  action: string;
  @IsString()
  code: string;
}

export class RemoveDiscountCodeAction {
  @Equals('removeDiscountCode')
  action: string;
  @IsString()
  code: string;
}

export class ValidateCartAction {
  @Equals('validateCart')
  action: string;
}

class CentPrecisionDto {
  @IsNumber()
  centAmount: number;
  @IsString()
  currencyCode: string;
}

export class SetLineItemPriceAction {
  @Equals('setLineItemPrice')
  action: string;

  @IsString()
  lineItemId: string;

  @ValidateNested()
  @Type(() => CentPrecisionDto)
  @IsOptional()
  externalPrice?: CentPrecisionDto;
}

class ChannelType {
  @IsString()
  typeId: string;
  @IsString()
  key: string;
}

export class AddLineItemAction {
  @Equals('addLineItem')
  action: string;

  @IsString()
  sku: string;

  @IsString()
  key: string;

  @IsNumber()
  quantity: number;

  @ValidateNested()
  @Type(() => ChannelType)
  distributionChannel: ChannelType;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChannelType)
  supplyChannel?: ChannelType;

  @IsOptional()
  custom?;
}

export class ChangeLineItemQuantityAction {
  @Equals('changeLineItemQuantity')
  action: string;
  @IsString()
  lineItemId: string;
  @IsNumber()
  quantity: number;
}

export class RemoveAddLineItemAction {
  @Equals('removeLineItem')
  action: string;
  @IsString()
  lineItemId: string;
}

export class SetBillingAddressAction {
  @Equals('setBilingAddress')
  action: string;
  @IsOptional()
  @ValidateNested()
  @Type(() => SetBillingShippingDetails)
  address?: SetBillingShippingDetails;
}

export class SetCustomerEmailAction {
  @Equals('setCustomerEmail')
  action: string;
  @IsOptional()
  email?: string;
}

export class SetLineItemCustomFieldAction {
  @Equals('setLineItemCustomField')
  action: string;
  @IsUUID()
  lineItemId: string;
  @IsString()
  name: string;
  @IsString()
  value: string;
}

export class SetLineItemCustomTypeAction {
  @Equals('setLineItemCustomType')
  action: string;
  @IsUUID()
  lineItemId: string;
  @IsString()
  key: string;
  @IsArray()
  @ValidateNested({ each: true })
  fields: CustomFields[];
}

export class SetCustomFieldAction {
  @Equals('setCustomField')
  action: string;
  @IsString()
  key: string;
  @IsString()
  value: string;
}

export class CustomFields {
  @IsString()
  name: string;
  @IsString()
  value: string;
}

class ChannelDto {
  @IsString()
  key: string;
}

class CollectorDto {
  @IsString()
  collectorFirstName: string;
  @IsString()
  collectorLastName: string;
}

export class CollectionDto {
  @ValidateNested()
  @Type(() => ChannelDto)
  channel: ChannelDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollectorDto)
  collector: CollectorDto;
}

export class ShippingAddressDto {
  @ValidateNested()
  @Type(() => ShippingDetails)
  address: ShippingDetails;
}

export enum ShippingGroup {
  DELIVERY = 'delivery',
  FAST_DELIVERY = 'fast-delivery',
  CLICK_AND_COLLECT = 'click-and-collect',
  DIGITAL = 'digital',
}

export class CalculateShippingAction {
  @Equals('calculateShipping')
  action: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsIn(Object.values(ShippingGroup), { each: true })
  groups: ShippingGroup[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shipping?: ShippingAddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CollectionDto)
  collection?: CollectionDto;
}

export class SetShippingAction {
  @Equals('setShipping')
  action: string;

  @IsString()
  group: ShippingGroup;

  @IsArray()
  @ArrayNotEmpty()
  methodKeys: string[];
}

export class SetLineItemSupplyChannelAction {
  @Equals('setLineItemSupplyChannel')
  action: string;

  @IsString()
  group: ShippingGroup;

  @IsArray()
  @ArrayNotEmpty()
  methodKeys: string[];
}

export class RemoveUnusedShippingAction {
  @Equals('removeUnusedShipping')
  action: string;
}

export class FreezeCartAction {
  @Equals('freezeCart')
  action: string;
}

export class UnfreezeCartAction {
  @Equals('unfreezeCart')
  action: string;
}

export class SetKeyAction {
  @Equals('setKey')
  action: string;

  @IsString()
  key: string;
}

export class AddPaymentAction {
  @Equals('addPayment')
  action: string;

  @IsUUID()
  key: string;
}

/**
 * Payment DTOs
 */
class PaymentMoney {
  @IsNumber()
  amount: number;
  @IsString()
  currencyCode: string;
}

export class PaymentMethod {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => PaymentMoney)
  total: PaymentMoney;
}

export class CartPaymentSessionCreateAction {
  @Equals('paymentSessionCreate')
  action: string;

  @IsString()
  sessionId: string;
}

export class CartPaymentBalanceCheckAction {
  @Equals('paymentBalanceCheck')
  action: string;

  @IsString()
  providerData: string;
}

export class CartPaymentAdditionalDetailsAction {
  @Equals('paymentAdditionalDetails')
  action: string;

  @IsOptional()
  @IsObject()
  formData?: Record<string, string>;

  @IsOptional()
  @IsObject()
  queryData?: Record<string, string>;

  @IsOptional()
  @IsString()
  providerData?: string;
}

export class CartPaymentCreatePaymentAction {
  @Equals('paymentCreate')
  action: string;

  @IsUrl()
  checkoutUrl: string;

  @IsUrl()
  returnUrl: string;

  @IsUUID()
  sessionId: string;

  @IsArray()
  @ValidateNested({ each: true })
  paymentMethods: PaymentMethod[];

  @IsString()
  providerData: string;
}

/**
 * Internal Update Cart Dtos
 */
export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'action',
      subTypes: [
        { value: SetCartDetailsAction, name: 'setCartDetails' },
        {
          value: SetCartMarketingPreferencesAction,
          name: 'setCartMarketingPreferences',
        },
        { value: AddDiscountCodeAction, name: 'addDiscountCode' },
        { value: RemoveDiscountCodeAction, name: 'removeDiscountCode' },
        { value: ValidateCartAction, name: 'validateCart' },
        { value: SetLineItemPriceAction, name: 'setLineItemPrice' },
        { value: AddLineItemAction, name: 'addLineItem' },
        { value: ChangeLineItemQuantityAction, name: 'changeLineItemQuantity' },
        { value: RemoveAddLineItemAction, name: 'removeLineItem' },
        { value: CalculateShippingAction, name: 'calculateShipping' },
        { value: SetShippingAction, name: 'setShipping' },
        { value: SetLineItemCustomFieldAction, name: 'setLineItemCustomField' },
        { value: SetLineItemCustomTypeAction, name: 'setLineItemCustomType' },
        { value: SetBillingAddressAction, name: 'setBillingAddress' },
        {
          value: SetLineItemSupplyChannelAction,
          name: 'setLineItemSupplyChannel',
        },
        {
          value: RemoveUnusedShippingAction,
          name: 'removeUnusedShipping',
        },
        {
          value: FreezeCartAction,
          name: 'freezeCart',
        },
        {
          value: UnfreezeCartAction,
          name: 'unfreezeCart',
        },
        {
          value: SetKeyAction,
          name: 'setKey',
        },
        { value: AddPaymentAction, name: 'addPayment' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  actions: UpdateCartActionDto[];
}

/**
 * Payment action dto
 */
export class PaymentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'action',
      subTypes: [
        { value: CartPaymentSessionCreateAction, name: 'paymentSessionCreate' },
        {
          value: CartPaymentAdditionalDetailsAction,
          name: 'paymentAdditionalDetails',
        },
        {
          value: CartPaymentBalanceCheckAction,
          name: 'paymentBalanceCheck',
        },
        {
          value: CartPaymentCreatePaymentAction,
          name: 'paymentCreate',
        },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  actions: PaymentActionDto[];
}

/**
 * Main Update Cart Request DTO
 */
export class UpdateCartRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'action',
      subTypes: [
        /**
         * Cart Actions
         */
        { value: SetCartDetailsAction, name: 'setCartDetails' },
        {
          value: SetCartMarketingPreferencesAction,
          name: 'setCartMarketingPreferences',
        },
        { value: AddDiscountCodeAction, name: 'addDiscountCode' },
        { value: RemoveDiscountCodeAction, name: 'removeDiscountCode' },
        { value: ValidateCartAction, name: 'validateCart' },
        { value: CalculateShippingAction, name: 'calculateShipping' },
        { value: SetShippingAction, name: 'setShipping' },
        { value: SetBillingAddressAction, name: 'setBillingAddress' },
        /**
         * Payment Actions
         */
        { value: CartPaymentSessionCreateAction, name: 'paymentSessionCreate' },
        {
          value: CartPaymentAdditionalDetailsAction,
          name: 'paymentAdditionalDetails',
        },
        {
          value: CartPaymentBalanceCheckAction,
          name: 'paymentBalanceCheck',
        },
        {
          value: CartPaymentCreatePaymentAction,
          name: 'paymentCreate',
        },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  actions: UpdateCartRequestActions[];
}

// We'll need one for the base update request and another one for all the
// other possible actions
export type UpdateCartRequestActions =
  | SetCartDetailsAction
  | SetCartMarketingPreferencesAction
  | AddDiscountCodeAction
  | RemoveDiscountCodeAction
  | ValidateCartAction
  | CalculateShippingAction
  | SetShippingAction
  | CartPaymentSessionCreateAction;

/**
 * Specifically for Cart Actions
 */
export type UpdateCartActionDto =
  | SetCartDetailsAction
  | SetCartMarketingPreferencesAction
  | AddDiscountCodeAction
  | RemoveDiscountCodeAction
  | ValidateCartAction
  | SetLineItemPriceAction
  | AddLineItemAction
  | ChangeLineItemQuantityAction
  | RemoveAddLineItemAction
  | CalculateShippingAction
  | SetKeyAction
  | SetShippingAction
  | SetLineItemCustomFieldAction
  | SetLineItemCustomTypeAction;

/**
 * Payment Actions
 */
export type PaymentActionDto =
  | CartPaymentSessionCreateAction
  | CartPaymentBalanceCheckAction
  | CartPaymentAdditionalDetailsAction
  | CartPaymentCreatePaymentAction;
