import { Expose } from 'class-transformer';
import { Shipping } from '@cw/cart-service/types/commercetools-cart.type';

export class AddressEntity {
  @Expose()
  country: string;
  @Expose()
  streetName: string;
  @Expose()
  streetNumber: string;
  @Expose()
  postalCode: string;
  @Expose()
  city: string;
  @Expose()
  state: string;
  @Expose()
  building: string;
  @Expose()
  phone: string;
  @Expose()
  latitude: number;
  @Expose()
  longitude: number;
  @Expose()
  deliveryNotes: string;
  @Expose()
  nickname: string;

  constructor(partial: Partial<AddressEntity>) {
    Object.assign(this, partial);
  }

  static fromShipping(shipping: Shipping): AddressEntity {
    const { shippingAddress } = shipping;
    // const additionalAddressInfo = shipping.shippingAddress.additionalAddressInfo
    //   ? JSON.parse(shippingAddress.additionalAddressInfo)
    //   : {};
    const customFields = shippingAddress.custom
      ? shippingAddress.custom.customFieldsRaw
      : [];

    let latitude,
      longitude,
      deliveryNotes,
      nickname = undefined;
    if (customFields.length) {
      latitude = customFields.find(
        (field) => field.name === 'cwr-latitude'
      )?.value;
      longitude = customFields.find(
        (field) => field.name === 'cwr-longitude'
      )?.value;
      deliveryNotes = customFields.find(
        (field) => field.name === 'cwr-delivery-notes'
      )?.value;
      nickname = customFields.find(
        (field) => field.name === 'cwr-address-nickname'
      )?.value;
    }
    return new AddressEntity({
      country: shippingAddress.country,
      streetName: shippingAddress.streetName,
      streetNumber: shippingAddress.streetNumber,
      postalCode: shippingAddress.postalCode,
      city: shippingAddress.city,
      state: shippingAddress.state,
      building: shippingAddress.building,
      phone: shippingAddress.phone,
      // latitude: additionalAddressInfo ? additionalAddressInfo.latitude : null,
      // longitude: additionalAddressInfo ? additionalAddressInfo.longitude : null,
      // deliveryNotes: additionalAddressInfo
      //   ? additionalAddressInfo.deliveryNotes
      //   : null,
      latitude: latitude ? latitude : null,
      longitude: longitude ? longitude : null,
      deliveryNotes: deliveryNotes ? deliveryNotes : null,
      nickname: nickname ? nickname : null,
    });
  }
}
