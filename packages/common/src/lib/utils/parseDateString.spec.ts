import { parseDateString } from './parseDateString'; // Update this with your file name

describe('parseDateString', () => {
  test('parses valid date string correctly', () => {
    const dateString = '18/04/24 12:34:56';
    const expectedDate = new Date(2024, 3, 18, 12, 34, 56);
    expect(parseDateString(dateString)).toEqual(expectedDate);
  });

  test('parses another valid date string correctly', () => {
    const dateString = '25/12/21 08:10:30';
    const expectedDate = new Date(2021, 11, 25, 8, 10, 30);
    expect(parseDateString(dateString)).toEqual(expectedDate);
  });

  test('parses midnight correctly', () => {
    const dateString = '01/01/22 00:00:00';
    const expectedDate = new Date(2022, 0, 1, 0, 0, 0);
    expect(parseDateString(dateString)).toEqual(expectedDate);
  });

  test('throws error for invalid date string', () => {
    const invalidDateString = 'invalid date string';
    expect(() => {
      parseDateString(invalidDateString);
    }).toThrow(`Invalid date string: "${invalidDateString}"`);
  });
});
