/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createSchemaIfNotExists('marketplace').then(() => {
    return knex.schema
      .withSchema('marketplace')
      .createTable('seller', function (table) {
        table.increments('id').primary();
        table.integer('marketplace_id').notNullable();
        table.string('name', 100).notNullable();
        table.decimal('seller_rate', 10, 2).notNullable();
        table.decimal('shipping_rate_threshold', 10, 2).notNullable();
        table.string('channel_key', 100).unique('seller_channel_key_index').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
      .createTable('sku', function (table) {
        table.increments('id').primary();
        table.integer('seller_id').unsigned().notNullable().references('id').inTable('marketplace.seller');
        table.integer('marketplace_id').unique('sku_marketplace_id_index').notNullable();
        table.decimal('sku_rate', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropSchemaIfExists('marketplace', true);
};
