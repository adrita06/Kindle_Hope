/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('donation_schedule', function (table) {
    table.increments('schedule_id').primary();
    table.decimal('amount', 12, 2).notNullable();
    table.string('frequency', 50).notNullable()
      .checkIn(['daily', 'weekly', 'monthly', 'yearly']); 
    table.date('start_date').notNullable();
    table.date('end_date');
    table.date('next_payment_date');
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
  return knex.schema.dropTable('donation_schedule');
};
