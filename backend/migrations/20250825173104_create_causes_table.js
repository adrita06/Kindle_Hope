/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('causes', function (table) {
    table.increments('cause_id').primary();
    table.string('title', 200).notNullable();
    table.text('description').notNullable();
    table.decimal('goal_amount', 12, 2).notNullable();
    table.decimal('collected_amount', 12, 2).defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('causes');
};

