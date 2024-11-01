/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Inserts seed entries
  await knex('store.delivery_partners').insert([
    {
      id: 'DP101',
      name: 'partner 1',
      status: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 'DP102',
      name: 'partner 2',
      status: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 'DP103',
      name: 'partner 3',
      status: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
