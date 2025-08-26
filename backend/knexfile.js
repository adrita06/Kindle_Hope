// knexfile.js
require("dotenv").config();

module.exports = {
  development: {
    client: "oracledb",
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT, // must be in form host:port/service_name
    },
    pool: {
      min: 0,
      max: 5,
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 60000,
    },
    migrations: {
      directory: "./migrations", // path to your migrations folder
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds", // optional, if you use seeds
    },
  },
};
