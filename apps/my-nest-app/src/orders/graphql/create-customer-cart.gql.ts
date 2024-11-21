import { SHARED_CART_SCHEMA } from './cart-schema.gql';

export const createCustomerCartGql = `
    mutation CreateCustomerCart(
        $storeKey: KeyReferenceInput!
        $customerId: String!
        $currency: Currency!
        $lineItemsDraft: [LineItemDraft!]!
        $deleteDaysAfterLastModification: Int!
    ) {
    createCart(
      storeKey: $storeKey
      draft: {
        customerId: $customerId
        deleteDaysAfterLastModification: $deleteDaysAfterLastModification
        currency: $currency
        shippingMode: Multiple
        inventoryMode: TrackOnly
        lineItems: $lineItemsDraft
        custom: {
          typeKey: "cwr-cart",
          fields: [
            {
              name: "cwr-marketing-sms-opt-in",
              value: "false"
            },
            {
              name: "cwr-marketing-email-opt-in",
              value: "false"
            },
           {
              name: "cwr-state",
              value: "\\"None\\""
            }
          ]
        }
      }
    ) ${SHARED_CART_SCHEMA}
  }`;

export function getActiveCustomerCartGql(customerId) {
  return `
    query GetActiveCustomerCart($storeKey: KeyReferenceInput!) {
      inStore(key: $storeKey) {
        carts(
          where: "customerId = \\"${customerId}\\" and cartState = \\"Active\\""
          sort: "lastModifiedAt desc",
          limit: 1
        ) {
          results ${SHARED_CART_SCHEMA}
        }
      }
    }
  `;
}
