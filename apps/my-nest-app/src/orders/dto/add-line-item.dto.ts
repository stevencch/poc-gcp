/* istanbul ignore file */

import { Type } from 'class-transformer';
import {
  Equals,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class GiftCardDetails {
  @Equals('gift-card')
  itemType: string;
  @IsString()
  recipientName: string;
  @IsEmail()
  recipientEmail: string;
  @IsString()
  senderName: string;
  @IsString()
  message: string;
  @IsDateString()
  deliveryDate: string;
}

class Prescription {
  @IsString()
  scriptType: string;
  @IsString()
  scriptPreference: string;
  @IsOptional()
  @IsString()
  prescriptionId?: string;
  @IsOptional()
  @IsString()
  eScriptInternalId?: string;
}

export class ScheduledDetails {
  @Equals('scheduled')
  itemType: string;

  @IsString()
  profileId: string;

  @IsOptional()
  @IsString()
  priceType?: string;

  @IsOptional()
  @IsString()
  prescription?: Prescription;
}

export class AddLineItemDto {
  @IsString()
  sku: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => GiftCardDetails, {
    discriminator: {
      property: 'itemType',
      subTypes: [
        { value: GiftCardDetails, name: 'gift-card' },
        { value: ScheduledDetails, name: 'scheduled' },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  details?: GiftCardDetails | ScheduledDetails;
}
