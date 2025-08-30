/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.dropTableIfExists('donation_schedule');
};

exports.down = function(knex) {
  // Optional: recreate the table if rolling back
  return knex.schema.createTable('donation_schedule', function(table) {
  });
};