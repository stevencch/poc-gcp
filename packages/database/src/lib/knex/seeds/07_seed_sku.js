/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Inserts seed entries
  await knex('marketplace.sku').insert([
    {
      seller_id: 1,
      marketplace_id: 1,
      sku_rate: 5.0,
    },
    {
      seller_id: 2,
      marketplace_id: 2,
      sku_rate: 9.99,
    },
  ]);
};
