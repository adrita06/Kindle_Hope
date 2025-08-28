exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('user_pass').notNullable();
    table.string('user_role');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};