/* istanbul ignore file */

/**
 * Util files to standardise the transformation of common commercetools fields
 */

/**
 *
 * @param nameAllLocales Commercetools nameAllLocales Field
 * @param locale
 * @returns
 */
export const transformValueByLocale = (
  nameAllLocales: {
    locale: string;
    value: string;
  }[],
  locale: string
) => {
  if (nameAllLocales !== undefined && nameAllLocales.length > 0) {
    const defaultValue = nameAllLocales.find((o) => o.locale === 'en')?.value;
    const localisedValue = nameAllLocales.find(
      (o) => o.locale === locale
    )?.value;
    return localisedValue || defaultValue;
  }
  throw new Error('Unknown name.');
};

/**
 *
 * @param price commercetools price format
 * @returns price after calculation
 */
export const convertPrice = (price: {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
}) => {
  return price.centAmount / Math.pow(10, price.fractionDigits);
};

/**
 *
 * @param customFieldsRaw commercetools custom field
 * @returns the custom field to object
 */
export const customFieldsToObject = (
  customFieldsRaw: { name: string; value: string | object }[]
) => {
  return customFieldsRaw.reduce((acc, field) => {
    acc[field.name] = field.value;
    return acc;
  }, {} as Record<string, string | object>);
};

export const validateBillingAddress = (address: {
  // BILLING-TODO: validate billing address
  firstName: string;
  lastName: string;
  country: string;
  streetNumber: string;
  streetName: string;
  postalCode: string;
  state?: string;
  phone?: string;
  t: string;
}) => {
  console.log(address);
  return (
    validateStringField(address.firstName, 100) &&
    validateStringField(address.lastName, 100) &&
    validateCountryCode(address.country) &&
    validateStringField(address.streetNumber, 20) &&
    validateStringField(address.streetName, 255) &&
    validateStringField(address.postalCode, 12) &&
    validateState(address.state, address.country) &&
    validatePhoneNumber(address.phone)
  );
};

export const ISO2_COUNTRIES = ['AU'];

export const AU_STATES = [
  'New South Wales',
  'Victoria',
  'Queensland',
  'South Australia',
  'Western Australia',
  'Tasmania',
  'Northern Territory',
  'Australian Capital Territory',
];

export function validateStringField(field: string, maxLength: number): boolean {
  if (field === undefined) return true;
  return (
    typeof field === 'string' && field.length > 0 && field.length <= maxLength
  );
}

export function validatePhoneNumber(phone: string | undefined): boolean {
  if (phone === undefined) return true; // Phone is optional
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
  return phoneRegex.test(phone);
}

export function validateCountryCode(country: string): boolean {
  if (country === undefined) return true;
  return ISO2_COUNTRIES.includes(country);
}

export function validateState(
  state: string | undefined,
  country: string
): boolean {
  if (state === undefined || country === undefined) return true;
  if (country === 'AU') {
    return state !== undefined && AU_STATES.includes(state);
  }
  return true;
}
