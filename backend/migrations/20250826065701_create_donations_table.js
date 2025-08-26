/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('donations', function (table) {
    table.increments('donation_id').primary();
    table.decimal('amount', 12, 2).notNullable();
    table.date('donation_date').notNullable();
    table.boolean('recurring_flag').defaultTo(false);
    table.boolean('anonymous_flag').defaultTo(false);
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('cause_id')
      .unsigned()
      .references('cause_id')
      .inTable('causes')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('donations');
};

