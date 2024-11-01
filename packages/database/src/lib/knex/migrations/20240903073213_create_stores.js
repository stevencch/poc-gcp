/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createSchemaIfNotExists('store').then(() => {
    return knex.schema
      .withSchema('store')
      .createTable('stores', (table) => {
        table.string('id', 100).primary();
        table.string('channel_key', 200).notNullable().unique({ indexName: 'store_channel_key_index' });
        table.string('store_name', 100).notNullable();
        table.specificType('coordinates', 'geography(point)').notNullable();
        table.string('timezone_identifier', 100).notNullable();
        table.string('address_line_1', 100).notNullable();
        table.string('address_line_2', 100).nullable();
        table.string('city', 50).notNullable();
        table.string('postalcode', 20).notNullable();
        table.string('state', 50).notNullable();
        table.string('country', 50).notNullable();
        table.boolean('cc_enabled').defaultTo(false);
        table.timestamp('cc_activation_date').defaultTo(null);
        table.boolean('fd_enabled').defaultTo(false);
        table.timestamp('fd_activation_date').defaultTo(null);
        table.boolean('omni_store_enabled').defaultTo(false);
        table.timestamp('omni_store_activation_date').defaultTo(null);
        table.boolean('schedule_2').defaultTo(false);
        table.boolean('schedule_3').defaultTo(false);
        table.boolean('schedule_4').defaultTo(false);
        table.boolean('schedule_8').defaultTo(false);
        table.boolean('is_active').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
      .createTable('delivery_partners', (table) => {
        table.string('id', 50).primary(); // Delivery Partner ID
        table.string('name', 100).notNullable();
        table.boolean('status').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
      .createTable('delivery_rates', (table) => {
        table.uuid('id').primary(); // DeliveryQouteGuid
        table.string('delivery_partner_id', 50).notNullable().references('id').inTable('store.delivery_partners');
        table.string('fd_service_type', 100).notNullable();
        table.decimal('max_boundary_km', 10, 2).notNullable();
        table.decimal('min_boundary_km', 10, 2).notNullable();
        table.decimal('delivery_price', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
      .createTable('store_delivery_schedule', (table) => {
        table.uuid('id').primary(); // DeliveryOptionId
        table.string('store_id').notNullable().references('id').inTable('store.stores');
        table.string('fd_service_type', 100).notNullable();
        table.string('order_type', 50).notNullable();
        table.decimal('range', 10, 2).notNullable();
        table.boolean('is_active').defaultTo(false);
        table.string('monday_delivery_partner_id', 50).nullable().references('id').inTable('store.delivery_partners');
        table.string('tuesday_delivery_partner_id', 50).nullable().references('id').inTable('store.delivery_partners');
        table
          .string('wednesday_delivery_partner_id', 50)
          .nullable()
          .references('id')
          .inTable('store.delivery_partners');
        table.string('thursday_delivery_partner_id', 50).nullable().references('id').inTable('store.delivery_partners');
        table.string('friday_delivery_partner_id', 50).nullable().references('id').inTable('store.delivery_partners');
        table.string('saturday_delivery_partner_id', 50).nullable().references('id').inTable('store.delivery_partners');
        table.string('sunday_delivery_partner_id', 50).nullable().references('id').inTable('store.delivery_partners');
        table.integer('ineligible_at_schedule').notNullable();
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
  return knex.schema.dropSchemaIfExists('store', true);
};
