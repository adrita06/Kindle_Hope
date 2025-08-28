exports.seed = async function(knex) {
  // Deletes ALL existing admin users
  await knex('users').where('user_role', 'admin').del();

  // Inserts a hardcoded admin user
  await knex('users').insert({
    name: 'Admin',
    email: 'admin@donation.com',
    user_pass: 'admin123', // You should hash this in production!
    user_role: 'admin'
  });
};