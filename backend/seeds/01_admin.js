const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  // Delete existing admins
  await knex('users').where('user_role', 'admin').del();

  // Hash password
  const hashedPass = await bcrypt.hash('Admin@123', 10);

  await knex('users').insert([
    {
      name: 'Super Admin',
      email: 'admin@donations.com',
      user_pass: hashedPass,
      user_role: 'admin'
    }
  ]);
};
