require('dotenv').config();   // must be at the very top

// knexfile.js
module.exports = {
  development: {
    client: 'oracledb',
    connection: {
      host: 'localhost',
      port: 1521,
      user: process.env.DB_USER,      // Replace with your Oracle username
      password: process.env.DB_PASSWORD,  // Replace with your Oracle password
      database: process.env.DB_CONNECT,  // Replace with your Oracle database/service name
      // Alternative: use connectString
      connectString: 'localhost:1521/XE'
    },
    pool: {
      min: 0,
      max: 2,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 60000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false,
      afterCreate: function (conn, cb) {
        conn.execute("ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD HH24:MI:SS'", [], cb);
      }
    },
    acquireConnectionTimeout: 60000,
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'oracledb',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: {
      min: 0,
      max: 3,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 60000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false
    },
    acquireConnectionTimeout: 60000,
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  }
};