import { LineItemDraft } from '@commercetools/platform-sdk';
import { CartUpdateAction } from "@commercetools/platform-sdk";

/**
 * Assign cart mutation
 */
export interface AssignCartVariables {
  storeKey: string;
  cartId: string;
  cartVersion: number;
  customerId: string;
  customerEmail: string;
  deleteDaysAfterLastModification: number;
}

/**
 * Create cart mutation
 */
export type CreateGuestCartVariables = {
  storeKey: string;
  lineItemsDraft: LineItemDraft[];
  currency: string;
  deleteDaysAfterLastModification: number;
};

export type CreateCustomerCartVariables = {
  storeKey: string;
  customerId: string;
  lineItemsDraft: LineItemDraft[];
  currency: string;
  deleteDaysAfterLastModification: number;
};


/**
 * Generic Store Key variable
 */
export interface StoreKeyVariable {
  storeKey: string;
}

export interface CustomerStoreKeyVariable {
  storeKey: string;
  customerId: string;
}

/**
 * Update cart mutation
 */
export type UpdateCartVariables = {
  storeKey: string;
  locale?: string;
  cartId: string;
  cartVersion: number;
  cartActions?: CartUpdateAction[];
};
