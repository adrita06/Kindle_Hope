/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('withdrawals', function (table) {
    table.increments('withdraw_id').primary();
    table.decimal('amount', 12, 2).notNullable();
    table.date('date').notNullable();
    table.string('purpose', 255).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('withdrawals');
};

