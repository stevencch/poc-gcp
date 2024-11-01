/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Inserts seed entries
  await knex('marketplace.seller').insert([
    {
      marketplace_id: 1,
      name: 'Seller A',
      seller_rate: 10.0,
      shipping_rate_threshold: 50.0,
      channel_key: 'A123',
    },
    {
      marketplace_id: 2,
      name: 'Seller B',
      seller_rate: 15.0,
      shipping_rate_threshold: 75.0,
      channel_key: 'B456',
    },
    {
      marketplace_id: 1,
      name: 'Seller C',
      seller_rate: 12.5,
      shipping_rate_threshold: 60.0,
      channel_key: 'C789',
    },
  ]);
};
