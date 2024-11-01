/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Truncating and restarting identity in store schema
  await knex.raw(
    'TRUNCATE store.stores, store.delivery_partners, store.delivery_rates, store.store_delivery_schedule RESTART IDENTITY CASCADE',
  );

  // Truncating and restarting identity in marketplace schema
  await knex.raw('TRUNCATE marketplace.sku, marketplace.seller RESTART IDENTITY CASCADE');
};
