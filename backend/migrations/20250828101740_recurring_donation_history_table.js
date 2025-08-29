/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('recurring_donation_history', (table) => {
    table.increments('history_id').primary(); // auto-increment primary key
    table.integer('schedule_id').notNullable();
    table.integer('user_id').notNullable();
    table.integer('cause_id').notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').nullable(); // when donation stopped
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable('recurring_donation_history');
};

