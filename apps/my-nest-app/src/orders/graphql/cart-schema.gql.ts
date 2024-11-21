export const SHARED_CART_SCHEMA = `
    {
        id
        key
        version
        cartState
        customerEmail
        customerId
        lastModifiedAt
        store {
            key
        }
        customLineItems {
            id
            key
            shippingDetails {
                targets {
                    addressKey
                    shippingMethodKey
                }
                valid
            }
            totalPrice {
                centAmount
                currencyCode
                fractionDigits
            }
            discountedPricePerQuantity {
                discountedPrice {
                    includedDiscounts {
                        discountedAmount {
                            centAmount
                            currencyCode
                            fractionDigits
                        }
                    }
                }
            }
        }
        itemShippingAddresses {
            key
        }
        billingAddress {
            firstName
            lastName
            building
            streetNumber
            streetName
            postalCode
            city
            state
            country
            phone
            mobile
            email
        }
        lineItems {
            id
            key
            priceMode
            lineItemMode
            productSlugAllLocales {
                locale
                value
            }
            nameAllLocales {
                locale
                value
            }
            productType {
                key
            }
            variant {
                sku
                images {
                    label
                    url
                    dimensions {
                        height
                        width
                    }
                }
                attributesRaw{
                    name
                    value
                    attributeDefinition {
                        labelAllLocales {
                            locale
                            value
                        }
                    }
                }
                prices {
                    custom {
                        customFieldsRaw {
                            name
                            value
                        }
                    }
                }
            }
            quantity
            discountedPricePerQuantity {
                quantity
                discountedPrice {
                    value {
                        centAmount
                        currencyCode
                        fractionDigits
                    }
                    includedDiscounts {
                        discount {
                            custom {
                                type {
                                    key
                                }
                                customFieldsRaw {
                                    name
                                    value
                                }
                            }
                            key
                            nameAllLocales {
                                locale
                                value
                            }
                            id
                        }
                        discountedAmount {
                            centAmount
                            fractionDigits
                            currencyCode
                        }
                    }
                }
            }
            price {
                value {
                    centAmount
                    currencyCode
                    fractionDigits
                }
                custom {
                    type {
                        key
                    }
                    customFieldsRaw {
                        name
                        value
                    }
                }
                discounted {
                    value {
                        centAmount
                        currencyCode
                        fractionDigits
                    }
                }
            }
            totalPrice {
                centAmount
                currencyCode
                fractionDigits
            }
            supplyChannel {
                id
                key
                nameAllLocales {
                    locale
                    value
                }
                custom {
                    type {
                        key
                    }
                }
            }
            shippingDetails {
                targets {
                    addressKey
                    quantity
                    shippingMethodKey
                }
                valid
            }
            custom {
                type {
                    key
                }
                customFieldsRaw {
                    name
                    value
                }
            }
        }
        shipping {
            shippingKey
            shippingCustomFields{
                type {
                    key
                }
                customFieldsRaw {
                    name
                    value
                }
            }
            shippingAddress {
                key
                firstName
                lastName
                building
                streetNumber
                streetName
                postalCode
                city
                state
                country
                phone
                additionalAddressInfo
                custom {
                    customFieldsRaw {
                        name
                        value
                    }
                }
            }
            shippingInfo {
                shippingMethodName
                price {
                    centAmount
                    currencyCode
                    fractionDigits
                }
            }
        }
        totalPrice {
            centAmount
            fractionDigits
            currencyCode
        }
        discountOnTotalPrice {
            discountedAmount {
                centAmount
                currencyCode
                fractionDigits
            }
        }
        discountCodes {
            discountCode {
                id
                code     
            }
            state
        }
        paymentInfo {
            payments {
                key
                createdAt
                amountPlanned {
                    centAmount
                    currencyCode
                    fractionDigits
                }
                paymentMethodInfo {
                    method
                    nameAllLocales {
                        locale
                        value
                    }
                }
                transactions {
                    type
                    state
                }
                custom {
                    type {
                        key
                    }
                    customFieldsRaw {
                        name
                        value
                    }
                }
            }
        }
        custom {
            type {
                key
            }
            customFieldsRaw {
                name
                value
            }
        }
    }
`;
