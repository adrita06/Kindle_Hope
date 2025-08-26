/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('cause_update', function (table) {
    table.increments('update_id').primary();
    table.string('image', 255);
    table.date('update_date').notNullable();
    table
      .integer('cause_id')
      .unsigned()
      .references('cause_id')
      .inTable('causes')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('cause_update');
};

