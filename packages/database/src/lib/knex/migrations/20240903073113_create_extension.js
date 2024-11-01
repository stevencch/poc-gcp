/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(
    'CREATE EXTENSION IF NOT EXISTS "postgis" CASCADE; CREATE EXTENSION IF NOT EXISTS "uuid-ossp" CASCADE;',
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw('DROP EXTENSION "postgis" CASCADE; DROP EXTENSION "uuid-ossp" CASCADE;');
};
