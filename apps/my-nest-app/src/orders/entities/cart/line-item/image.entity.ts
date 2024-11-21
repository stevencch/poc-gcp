import { Expose } from 'class-transformer';
import { Image, Dimensions } from '@cw/cart-service/types/commercetools-cart.type';

class DimensionsEntity {
    @Expose()
    w: number;
    @Expose()
    h: number

  constructor(image: Dimensions) {
    this.w = image.width;
    this.h = image.height;
  }

}

export class ImageEntity {
  @Expose()
  url?: string;

  @Expose()
  label?: string;

  @Expose()
  dimensions?: DimensionsEntity

  constructor(images: Image[]) {
    if (images.length > 0) {
      this.url = images[0].url;
      this.label = images[0].label;
      this.dimensions = new DimensionsEntity(images[0].dimensions)
    }
  }
}
