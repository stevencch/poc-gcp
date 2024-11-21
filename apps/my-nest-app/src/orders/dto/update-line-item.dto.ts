/* istanbul ignore file */

import { Type } from 'class-transformer';
import {
  Equals,
  IsArray,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class RemoveItemDto {
  @Equals('removeItem') action: string;
  @IsUUID()
  itemId: string;
}

export class UpdateQuantityDto {
  @Equals('setItemQuantity')
  action: string;
  @IsUUID()
  itemId: string;
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;
}

export class UpdateLineItemDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object, {
    discriminator: {
      property: 'action',
      subTypes: [
        { value: RemoveItemDto, name: 'removeItem' },
        { value: UpdateQuantityDto, name: 'setItemQuantity' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  actions: UpdateLineItemRequestDto;
}

export type UpdateLineItemRequestDto = (UpdateQuantityDto | RemoveItemDto)[];
